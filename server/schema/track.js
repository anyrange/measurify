import fp from "fastify-plugin";
import { entity, entities } from "./entity.js";

const track = {
  type: "object",
  properties: Object.assign(
    { album: entity, artists: entities },
    entity.properties
  ),
};

const tracks = { type: "array", items: track };

const withDuration = {
  type: "object",
  properties: Object.assign(
    { duration_ms: { type: "number" } },
    track.properties
  ),
};

const plugin = fp(async (fastify) => {
  fastify.addSchema(
    Object.assign(
      { $id: "track", title: "track", definitions: { withDuration } },
      track
    )
  );
  fastify.addSchema(
    Object.assign(
      {
        $id: "tracks",
        title: "tracks",
        definitions: { withDuration: { type: "array", items: withDuration } },
      },
      tracks
    )
  );
});

export default plugin;
export { track, tracks };
