const sortByDates = (arr) => {
  return arr.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
};

export default async function (fastify) {
  fastify.get(
    "",
    {
      schema: {
        description: "experimental feat: news feed",
        querystring: {
          type: "object",
          properties: {
            range: { type: "number", minimum: 1, default: 25 },
            page: { type: "number", minimum: 1, default: 1 },
            offsetListened: { type: "number", minimum: 0, default: 0 },
            offsetLiked: { type: "number", minimum: 0, default: 0 },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              status: { type: "number" },
              next: { type: "string" },
              activity: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    display_name: { type: "string" },
                    avatar: { type: "string" },
                    username: { type: "string" },
                    track: { $ref: "track#" },
                    date: { type: "string", format: "datetime" },
                    type: { type: "string", enum: ["liked", "listened"] },
                  },
                },
              },
            },
          },
        },
        tags: ["other"],
      },
      preValidation: [fastify.auth],
    },
    async function (req, reply) {
      const id = req.session.get("id");

      const { page, offsetListened, offsetLiked, range } = req.query;

      const friends = await fastify.userFriends(id);

      const [trackActivity, ...likeActivity] = await Promise.all([
        fastify.db.User.aggregate([
          {
            $match: {
              "tokens.refreshToken": { $ne: "" },
              $or: friends.map(({ _id }) => ({ _id })),
            },
          },
          { $unwind: { path: "$listeningHistory" } },
          { $sort: { "listeningHistory.played_at": -1 } },
          { $skip: offsetListened },
          { $limit: range },
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
              username: "$settings.username",
              date: "$listeningHistory.played_at",
              track: {
                album: { $first: "$album" },
                artists: "$artists",
                id: "$listeningHistory.track",
                name: { $first: "$tracks.name" },
                duration_ms: { $first: "$tracks.duration_ms" },
                image: { $arrayElemAt: [{ $first: "$album.images" }, -1] },
              },
              type: "listened",
            },
          },
        ]),
        ...friends.map((friend) =>
          fastify.spotifyAPI({
            route: `me/tracks?limit=${range}&offset=${(page - 1) * range}`,
            token: friend.tokens.token,
          })
        ),
      ]);

      const formatedLikeActivity = sortByDates(
        likeActivity
          .map(({ items }, key) =>
            items.map((item) => ({
              display_name: friends[key].display_name,
              avatar: friends[key].avatar,
              username: friends[key].username,
              type: "liked",
              date: new Date(item.added_at),
              track: Object.assign(item.track, {
                image: item.track.album.images[1]?.url || "",
              }),
            }))
          )
          .flat(1)
      );

      const activity = sortByDates([
        ...trackActivity,
        ...formatedLikeActivity.slice(offsetLiked),
      ]).slice(0, range);

      const newOffsetListened =
        offsetListened + activity.filter((a) => a.type === "listened").length;
      const newOffsetLiked =
        offsetLiked + activity.filter((a) => a.type === "liked").length;
      const nextPage = newOffsetLiked >= formatedLikeActivity.length;

      reply.send({
        activity,
        next: `${process.env.VITE_SERVER_URI}/community?page=${
          page + nextPage
        }&range=${range}&offsetLiked=${
          nextPage ? 0 : newOffsetLiked
        }&offsetListened=${newOffsetListened}`,
      });
    }
  );
}
