import fp from "fastify-plugin";

const plugin = fp(async function plugin(fastify) {
  const withSearch = async ({ _id, page = 1, range = 15, search }) => {
    const query = new RegExp(
      `.*${search.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&")}.*`,
      "i"
    );

    const [foundArtists, foundAlbums, foundTracks] = await Promise.all([
      fastify.db.Artist.find({ name: { $regex: query } }, { id: "$_id" }),
      fastify.db.Album.find({ name: { $regex: query } }, { id: "$_id" }),
      fastify.db.Track.find({ name: { $regex: query } }, { id: "$_id" }),
    ]);

    const extraTracks = await fastify.db.Track.find(
      {
        $or: [
          { artists: { $in: foundArtists.map(({ id }) => id) } },
          { album: { $in: foundAlbums.map(({ id }) => id) } },
        ],
      },
      { id: "$_id" }
    );

    const uniqueTracks = [
      ...new Set([
        ...foundTracks.map(({ id }) => id),
        ...extraTracks.map(({ id }) => id),
      ]),
    ];

    const [listeningHistory, count] = await Promise.all([
      fastify.db.User.aggregate()
        .match({ _id })
        .unwind("listeningHistory")
        .match({ "listeningHistory.track": { $in: uniqueTracks } })
        .project("listeningHistory")
        .lookup({
          from: "tracks",
          localField: "listeningHistory.track",
          foreignField: "_id",
          as: "tracks",
        })
        .lookup({
          from: "albums",
          localField: "tracks.album",
          foreignField: "_id",
          as: "albums",
        })
        .lookup({
          from: "artists",
          localField: "tracks.artists",
          foreignField: "_id",
          as: "artists",
        })
        .addFields({
          id: "$listeningHistory.track",
          played_at: "$listeningHistory.played_at",
          name: { $first: "$tracks.name" },
          duration_ms: { $first: "$tracks.duration_ms" },
          image: { $first: "$albums.images.lowQuality" },
          album: {
            id: { $first: "$albums._id" },
            name: { $first: "$albums.name" },
          },
          artists: { id: "$artists._id" },
        })
        .sort("-played_at")
        .skip((page - 1) * range)
        .limit(range),
      fastify.db.User.aggregate()
        .match({ _id })
        .unwind("listeningHistory")
        .match({ "listeningHistory.track": { $in: uniqueTracks } })
        .count("total"),
    ]);

    const totalListened = count[0]?.total || 0;
    return {
      pages: Math.ceil(totalListened / range) || 1,
      history: listeningHistory,
    };
  };

  const withoutSearch = async ({ _id, page = 1, range = 15 }) => {
    const { listeningHistory, listened } = await fastify.db.User.findById(
      _id,
      "listeningHistory listened"
    )
      .slice("listeningHistory", [(page - 1) * range, range])
      .populate({
        path: "listeningHistory.track",
        select: {
          id: "$_id",
          name: 1,
          image: "$images.lowQuality",
          duration_ms: 1,
          album: 1,
          artists: 1,
        },
        populate: [
          {
            path: "album",
            select: { id: "$_id", name: 1 },
          },
          {
            path: "artists",
            select: { id: "$_id", name: 1 },
          },
        ],
      })
      .lean();

    const totalListened = listened?.count || 0;
    const brokenItems = listeningHistory
      .filter((item) => !item.track.album || !item.track.artists.length)
      .map((item) => item.track._id);

    if (brokenItems.length > 0) {
      const { addTrack } = await import(
        "#server/includes/cron-workers/historyParser/tracks.js"
      );
      const replacement = await Promise.all(
        brokenItems.map((id) => addTrack(id))
      );

      listeningHistory.forEach((item) => {
        const replacementId = replacement.findIndex(
          (newItem) => item.track._id === newItem._id
        );

        if (replacementId === -1) return;

        const newItem = replacement[replacementId];
        newItem.image = newItem.images.lowQuality;
        item.track = newItem;
      });
    }

    return {
      history:
        listeningHistory?.map((item) => ({
          ...item.track,
          played_at: item.played_at,
        })) || [],
      pages: Math.ceil(totalListened / range) || 1,
    };
  };

  fastify.decorate("userListeningHistory", async ({ search, ...args }) => {
    return search
      ? await withSearch({ ...args, search })
      : await withoutSearch(args);
  });
});

export default plugin;
