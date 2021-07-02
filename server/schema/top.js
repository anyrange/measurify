import fp from "fastify-plugin";

const topItem = {
  type: "object",
  required: ["id", "image", "name", "playtime"],
  properties: {
    id: { type: "string" },
    image: { type: "string" },
    name: { type: "string" },
    playtime: { type: "number" },
  },
};

const plugin = fp(async function plugin(fastify) {
  fastify.addSchema({
    $id: "top",
    title: "top",
    type: "object",
    properties: {
      tracks: { type: "array", items: topItem },
      albums: { type: "array", items: topItem },
      artists: { type: "array", items: topItem },
      playlists: { type: "array", items: topItem },
    },
  });
});

export default plugin;
