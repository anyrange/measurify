import fp from "fastify-plugin";

const plugin = fp(async function plugin(fastify) {
  fastify.addSchema({
    $id: "date",
    title: "date",
    type: "string",
    pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$",
  });
});

export default plugin;
