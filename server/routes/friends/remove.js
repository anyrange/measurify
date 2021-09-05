export default async function (fastify) {
  fastify.delete(
    "",
    {
      schema: {
        query: {
          type: "object",
          require: ["username"],
          properties: { username: { type: "string" } },
        },
        tags: ["friends"],
      },
    },
    async function (req, reply) {
      const id = req.session.get("id");
      const username = req.query.username;

      const user = await fastify.db.User.findOne(
        { "settings.username": username },
        "_id"
      );
      if (!user) throw fastify.error("User not found", 404);

      const requests = await Promise.all([
        fastify.db.User.updateOne(
          { _id: user._id },
          { $pull: { friends: id } }
        ),
        fastify.db.User.updateOne(
          { _id: id },
          { $pull: { friends: user._id } }
        ),
        fastify.db.FriendRequest.create({
          from: user._id,
          to: id,
        }),
      ]);

      if (!requests[0].n && !requests[1].n)
        throw fastify.error("Friend not found", 404);

      reply.code(204).send();
    }
  );
}
