import fp from "fastify-plugin"

const plugin = fp(async function plugin(fastify) {
  fastify.setNotFoundHandler((req, reply) => {
    return reply.code(404).send({ message: "Service not found", status: 404 })
  })
})

export default plugin
