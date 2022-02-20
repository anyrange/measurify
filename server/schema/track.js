import fp from "fastify-plugin";
import { entity, entities } from "./entity.js";

const track = {
  type: "object",
  properties: {
    ...entity.properties,
    album: entity,
    artists: entities,
  },
};

const tracks = { type: "array", items: track };

const withDuration = {
  type: "object",
  properties: {
    ...track.properties,
    duration_ms: { type: "number" },
  },
};

const plugin = fp(async (fastify) => {
  fastify.addSchema({
    ...track,
    $id: "track",
    title: "track",
    definitions: { withDuration },
  });

  fastify.addSchema({
    ...tracks,
    $id: "tracks",
    title: "tracks",
    definitions: { withDuration: { type: "array", items: withDuration } },
  });
});

export default plugin;
export { track, tracks };
