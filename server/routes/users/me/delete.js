export default async function (fastify) {
  fastify.delete(
    "",
    {
      schema: { tags: ["users"] },
      preValidation: [fastify.auth],
    },
    async function (req, reply) {
      const id = req.session.get("id");

      await fastify.db.User.deleteOne({ _id: id });

      req.session.delete();
      reply.code(204).send();
    }
  );
}
