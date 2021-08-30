import fp from "fastify-plugin";

const plugin = fp(async function plugin(fastify) {
  fastify.decorate("error", (message, code) =>
    Object.assign(new Error(message), { code })
  );
});

export default plugin;
