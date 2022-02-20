import fp from "fastify-plugin";
import { entity, entities } from "./entity.js";

const album = {
  type: "object",
  properties: {
    ...entity.properties,
    artists: entities,
  },
};

const albums = { type: "array", items: album };

const plugin = fp(async (fastify) => {
  fastify.addSchema({ $id: "album", title: "album", ...album });
  fastify.addSchema({ $id: "albums", title: "albums", ...albums });
});

export default plugin;
export { album, albums };
