import fp from "fastify-plugin";
import CustomError from "../../includes/CustomError.js";

const plugin = fp(async function plugin(fastify) {
  fastify.decorate("CustomError", CustomError);
});

export default plugin;
