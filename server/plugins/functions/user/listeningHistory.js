import fp from "fastify-plugin";

const plugin = fp(async function plugin(fastify) {
  fastify.decorate(
    "userListeningHistory",
    async ({ _id, range, page = 1, search }) => {
      const agg = [
        { $match: { _id } },
        { $project: { listeningHistory: 1 } },
        { $unwind: { path: "$listeningHistory" } },
        {
          $lookup: {
            from: "tracks",
            localField: "listeningHistory.track",
            foreignField: "_id",
            as: "tracks",
          },
        },
        {
          $lookup: {
            from: "albums",
            localField: "tracks.album",
            foreignField: "_id",
            as: "album",
          },
        },
        {
          $lookup: {
            from: "artists",
            localField: "tracks.artists",
            foreignField: "_id",
            as: "artists",
          },
        },
        {
          $addFields: {
            _id: "$listeningHistory.track",
            album: { $first: "$album" },
            played_at: "$listeningHistory.played_at",
            id: "$listeningHistory.track",
            name: { $first: "$tracks.name" },
            duration_ms: { $first: "$tracks.duration_ms" },
            image: { $arrayElemAt: [{ $first: "$album.images" }, -1] },
          },
        },
      ];

      if (search) {
        const query = new RegExp(
          `.*${search.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&")}.*`,
          "i"
        );
        agg.push({
          $match: {
            $or: [
              { "tracks.name": { $regex: query } },
              { "artists.name": { $regex: query } },
              { "album.name": { $regex: query } },
            ],
          },
        });
      }

      agg.push(
        { $sort: { played_at: -1 } },
        { $skip: (page - 1) * range },
        { $limit: range },
        {
          $group: {
            _id: "",
            history: {
              $push: {
                id: "$id",
                name: "$name",
                image: "$image",
                duration_ms: "$duration_ms",
                played_at: "$played_at",
                album: "$album",
                artists: "$artists",
              },
            },
            items: { $sum: 1 },
          },
        }
      );

      const [listened] = await fastify.db.User.aggregate(agg).allowDiskUse(
        true
      );

      return {
        pages: Math.ceil((listened?.items || 0) / range) || 1,
        history: listened?.history || [],
      };
    }
  );
});

export default plugin;
