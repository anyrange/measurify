import fp from "fastify-plugin";
import { entity } from "./entity.js";

const topItems = {
  type: "array",
  items: {
    type: "object",
    required: ["id", "image", "name", "plays"],
    properties: Object.assign({ plays: { type: "number" } }, entity.properties),
  },
};

const plugin = fp(async function plugin(fastify) {
  fastify.addSchema({
    $id: "top",
    title: "top",
    type: "object",
    properties: {
      tracks: topItems,
      albums: topItems,
      artists: topItems,
      playlists: topItems,
    },
  });
});

export default plugin;
