export default async function (fastify) {
  fastify.delete(
    "",
    {
      schema: { tags: ["users"] },
      preValidation: [fastify.auth],
    },
    async function (req, reply) {
      const id = req.user.id

      await fastify.db.User.deleteOne({ _id: id })

      req.session.delete()
      return reply.code(204).send()
    }
  )
}
