export default async function (fastify) {
  fastify.addHook("preValidation", fastify.auth)
}
