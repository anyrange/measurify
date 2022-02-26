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
            items: { $ref: "user#" },
          },
        },
        tags: ["user"],
      },
    },
    async function (req, reply) {
      const { username } = req.params;

      const user = await fastify.db.User.findOne(
        { "settings.username": username },
        "follows"
      )
        .populate("follows", {
          avatar: 1,
          display_name: 1,
          username: "$settings.username",
        })
        .lean();

      if (!user) return reply.code(404).send({ message: "User not found" });

      reply.send(user.follows);
    }
  );
}
