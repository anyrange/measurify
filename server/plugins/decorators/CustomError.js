import fp from "fastify-plugin";

const plugin = fp(async function plugin(fastify) {
  class CustomError extends Error {
    constructor(message, status) {
      super(message);
      this.status = status;
      this.name = "CustomError";
    }
  }

  fastify.decorate("CustomError", CustomError);
});

export default plugin;
