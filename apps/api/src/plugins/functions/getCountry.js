import fp from "fastify-plugin"

const plugin = fp(async (fastify) =>
  fastify.decorate("getCountry", async (_id) => {
    const user = _id
      ? await fastify.db.User.findOne({ _id }, "country").lean()
      : { country: "US" }

    return user.country
  })
)

export default plugin
