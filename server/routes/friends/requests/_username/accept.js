export default async function (fastify) {
  fastify.get(
    "",
    {
      schema: {
        description: "accept",
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

      const request = await fastify.db.FriendRequest.findOne({
        from: user._id,
        to: id,
      });

      if (!request) throw fastify.error("Request not found", 404);

      await Promise.all([
        fastify.db.FriendRequest.deleteOne({
          from: user._id,
          to: id,
        }),
        fastify.db.User.updateOne(
          { _id: id },
          { $push: { friends: user._id } }
        ),
        fastify.db.User.updateOne(
          { _id: user._id },
          { $push: { friends: id } }
        ),
      ]);

      reply.code(204).send();
    }
  );
}
