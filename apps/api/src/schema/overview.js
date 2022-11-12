import fp from "fastify-plugin"

const plugin = fp(async function plugin(fastify) {
  fastify.addSchema({
    $id: "overview",
    title: "overview",
    type: "object",
    required: ["plays", "playtime"],
    properties: {
      plays: { type: "number" },
      playtime: { type: "number" },
    },
  })
})

export default plugin
