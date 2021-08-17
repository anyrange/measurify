import fp from "fastify-plugin";
import { entity, entities } from "./entity.js";

const album = {
  type: "object",
  properties: Object.assign({ artists: entities }, entity.properties),
};

const albums = { type: "array", items: album };

const plugin = fp(async (fastify) => {
  fastify.addSchema(Object.assign({ $id: "album", title: "album" }, album));
  fastify.addSchema(Object.assign({ $id: "albums", title: "albums" }, albums));
});

export default plugin;
export { album, albums };
