import fp from "fastify-plugin";

const plugin = fp(async function plugin(fastify) {
  fastify.addSchema({
    $id: "rates",
    title: "rates",
    type: "object",
    properties: {
      LT: { type: "number" },
      MT: { type: "number" },
      ST: { type: "number" },
    },
  });
});

export default plugin;
