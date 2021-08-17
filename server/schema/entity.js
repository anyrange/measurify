import fp from "fastify-plugin";

const entity = {
  type: "object",
  properties: {
    name: { type: "string" },
    image: { type: "string" },
    id: { type: "string" },
  },
};

const entities = { type: "array", items: entity };

const plugin = fp(async (fastify) => {
  fastify.addSchema(Object.assign({ $id: "entity", title: "entity" }, entity));
  fastify.addSchema(
    Object.assign({ $id: "entities", title: "entities" }, entities)
  );
});

export default plugin;
export { entity, entities };
