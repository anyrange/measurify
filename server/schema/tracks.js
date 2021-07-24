import fp from "fastify-plugin";

const plugin = fp(async function plugin(fastify) {
  fastify.addSchema({
    $id: "tracks",
    title: "tracks",
    type: "array",
    items: fastify.getSchema("track"),
  });
});

export default plugin;
