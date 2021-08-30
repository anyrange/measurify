import fp from "fastify-plugin";

const plugin = fp(async function plugin(fastify) {
  fastify.addSchema({
    $id: "user",
    title: "user",
    type: "object",
    properties: {
      username: { type: "string" },
      avatar: { type: "string" },
      display_name: { type: "string" },
      canSee: { type: "boolean" },
      lastLogin: { type: "string", format: "datetime" },
      listened: { type: "number" },
    },
  });
});

export default plugin;
