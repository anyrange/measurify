import fp from "fastify-plugin";
import getRandomToken from "#server/includes/getRandomToken.js";

const plugin = fp(async (fastify) =>
  fastify.decorate("getRandomToken", getRandomToken)
);

export default plugin;
