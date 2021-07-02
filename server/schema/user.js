import fp from "fastify-plugin";

const plugin = fp(async function plugin(fastify) {
  fastify.addSchema({
    $id: "user",
    title: "user",
    type: "object",
    properties: {
      userName: { type: "string" },
      avatar: { type: "string" },
      customID: { type: "string" },
      canSee: { type: "boolean" },
      lastLogin: { type: "string" },
      listened: { type: "number" },
    },
  });
});

export default plugin;
