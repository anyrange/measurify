export default async function (fastify) {
  fastify.get(
    "",
    {
      schema: {
        params: {
          type: "object",
          required: ["username"],
          properties: { username: { type: "string" } },
        },
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: {
                username: { type: "string" },
                avatar: { type: "string" },
                display_name: { type: "string" },
                lastTrack: { $ref: "entity#" },
                lastPlayed: { type: "string", format: "datetime" },
                lastLogin: { type: "string", format: "datetime" },
              },
            },
          },
        },
        tags: ["user"],
      },
    },
    async function (req, reply) {
      const { username } = req.params;

      const user = await fastify.db.User.findOne(
        {
          "settings.username": username,
          "settings.privacy": { $ne: "private" },
        },
        "followers"
      )
        .populate({
          path: "followers",
          select: {
            listeningHistory: { $first: "$listeningHistory" },
            lastPlayed: { $first: "$listeningHistory.played_at" },
            avatar: 1,
            display_name: 1,
            lastLogin: "$lastLogin",
            username: "$settings.username",
          },
          populate: {
            path: "listeningHistory.track",
            select: {
              id: "$_id",
              name: 1,
            },
          },
        })
        .lean();

      if (!user) return reply.code(404).send({ message: "User not found" });

      reply.send(
        user.followers.map((user) => ({
          ...user,
          lastTrack: user.listeningHistory?.track,
        }))
      );
    }
  );
}
