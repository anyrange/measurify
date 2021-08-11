import fp from "fastify-plugin";

const plugin = fp(async function plugin(fastify) {
  fastify.addSchema({
    $id: "track",
    title: "track",
    type: "object",
    properties: {
      id: { type: "string" },
      name: { type: "string" },
      image: { type: "string" },
      duration_ms: { type: "number" },
      playtime: { type: "number" },
      plays: { type: "number" },
      popularity: { type: "number" },
      preview_url: { type: "string" },
      release_date: { type: "string" },
      played_at: { type: "string" },
      link: { type: "string" },
      lastPlayedAt: { type: "string" },
      album: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
        },
      },
      artists: fastify.getSchema("artists"),
    },
  });
});

export default plugin;
