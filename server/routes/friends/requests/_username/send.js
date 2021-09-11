export default async function (fastify) {
  fastify.post(
    "",
    {
      schema: {
        summary: "send request",
        params: {
          type: "object",
          properties: { username: { type: "string" } },
        },
        tags: ["friends"],
      },
    },
    async function (req, reply) {
      const id = req.session.get("id");
      const username = req.params.username;

      const user = await fastify.db.User.findOne(
        { "settings.username": username },
        "_id"
      );
      if (!user) throw fastify.error("User not found", 404);
      if (user._id === id) throw fastify.error("Cannot befriend yourself", 403);

      const request = await fastify.db.FriendRequest.findOne({
        from: id,
        to: user._id,
      });
      if (request) throw fastify.error("Request have already been sent", 400);

      reply.code(204).send();

      await fastify.db.FriendRequest.create({
        from: id,
        to: user._id,
      });
    }
  );
}
