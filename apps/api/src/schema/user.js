import fp from "fastify-plugin"

const plugin = fp(async function plugin(fastify) {
  fastify.addSchema({
    $id: "user",
    title: "user",
    type: "object",
    properties: {
      username: { type: "string" },
      avatar: { type: "string" },
      display_name: { type: "string" },
      lastLogin: { type: "string", format: "date-time" },
      registrationDate: { type: "string", format: "date-time" },
      spotifyID: { type: "string" },
      country: { type: "string" },
    },
  })
})

export default plugin
