export default async function (fastify) {
  fastify.addHook("onSend", async (req, reply) => {
    reply.removeHeader("Cache-Control");
  });
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
                private: { type: "boolean" },
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
        { "settings.username": username },
        "follows settings.privacy"
      )
        .populate({
          path: "follows",
          select: {
            listeningHistory: { $first: "$listeningHistory" },
            lastPlayed: { $first: "$listeningHistory.played_at" },
            avatar: 1,
            display_name: 1,
            refreshToken: "$tokens.refreshToken",
            lastLogin: "$lastLogin",
            username: "$settings.username",
            privacy: "$settings.privacy",
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

      const isPrivate = user.settings.privacy === "private";
      const requestorID = req.session.get("id");
      if (isPrivate && user._id !== requestorID)
        return reply.code(403).send({ message: "Private profile" });

      reply.send(
        user.follows?.map((user) => ({
          ...user,
          inactive: user.refreshToken === "",
          private: user.privacy === "private",
          lastTrack: user.listeningHistory?.track,
        })) || []
      );
    }
  );
}
