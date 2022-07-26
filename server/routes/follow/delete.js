export default async function (fastify) {
  fastify.delete(
    "",
    {
      schema: {
        query: {
          type: "object",
          required: ["username"],
          properties: {
            username: { type: "string" },
          },
        },
        tags: ["follow"],
      },
    },
    async function (req, reply) {
      const _id = req.user.id;
      const username = req.query.username;

      const user = await fastify.db.User.findOne(
        { "settings.username": username },
        "_id followers"
      );

      if (!user) return reply.code(404).send({ message: "User not found" });

      const userID = user._id;

      await Promise.all([
        fastify.db.User.updateOne({ _id }, { $pull: { follows: userID } }),
        fastify.db.User.updateOne(
          { _id: userID },
          { $pull: { followers: _id } }
        ),
      ]);

      return reply.code(204).send();
    }
  );
}
