import fp from "fastify-plugin";

const plugin = fp(async function plugin(fastify) {
  fastify.addSchema({
    $id: "artists",
    title: "artists",
    type: "array",
    items: {
      type: "object",
      properties: {
        name: { type: "string" },
        image: { type: "string" },
        id: { type: "string" },
        genres: { type: "array", items: { type: "string" } },
        popularity: { type: "number" },
      },
    },
  });
});

export default plugin;
