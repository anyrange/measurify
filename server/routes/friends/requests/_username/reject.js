export default async function (fastify) {
  fastify.delete(
    "",
    {
      schema: {
        description: "reject",
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

      const requests = await Promise.all([
        fastify.db.FriendRequest.deleteOne({ from: user._id, to: id }),
        fastify.db.FriendRequest.deleteOne({ from: id, to: user._id }),
      ]);

      if (!requests[0].n && !requests[1].n)
        throw fastify.error("Request not found", 404);

      reply.code(204).send();
    }
  );
}
