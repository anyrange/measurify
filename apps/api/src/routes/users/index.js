export default async function (fastify) {
  fastify.get(
    "",
    {
      schema: {
        response: {
          200: {
            type: "object",
            required: ["quantity", "status"],
            properties: {
              quantity: { type: "number" },
              status: { type: "number" },
            },
          },
        },
        tags: ["users"],
      },
    },
    async function () {
      const quantity = await fastify.db.User.estimatedDocumentCount()
      return { quantity }
    }
  )
}
