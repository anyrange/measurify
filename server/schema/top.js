import fp from "fastify-plugin";
import { entity } from "./entity.js";
import { track } from "./track.js";

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
      tracks: {
        type: "array",
        items: {
          type: "object",
          properties: {
            ...track.properties,
            plays: { type: "number" },
            duration_ms: { type: "number" },
          },
        },
      },
      albums: topItems,
      artists: topItems,
    },
  });
  fastify.addSchema({
    $id: "topItems",
    title: "topItems",
    ...topItems,
  });
});

export default plugin;
