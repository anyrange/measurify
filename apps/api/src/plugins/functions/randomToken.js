import fp from "fastify-plugin"
import getRandomToken from "#src/includes/getRandomToken.js"

const plugin = fp(async (fastify) =>
  fastify.decorate("getRandomToken", getRandomToken)
)

export default plugin
