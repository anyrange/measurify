import User from "#src/models/User.js"

export default async function (fastify) {
  fastify.post(
    "",
    {
      schema: {
        body: {
          type: "object",
          required: ["privacy", "username", "display_name"],
          properties: {
            privacy: {
              type: "string",
              pattern: "^(public|private)$",
            },
            username: {
              type: "string",
              maxLength: 20,
              minLength: 3,
              pattern:
                "^(?!.*(?:overview|listening-history|about|profile|top-listeners|account|track))[a-z0-9_-]{3,16}$",
            },
            display_name: { type: "string", minLength: 3, maxLength: 30 },
          },
        },
        response: {
          "2xx": {
            type: "object",
            required: ["message"],
            properties: { message: { type: "string" } },
          },
          "4xx": {
            type: "object",
            required: ["message"],
            properties: { message: { type: "string" } },
          },
        },
        tags: ["settings"],
      },
    },
    async function (req, reply) {
      const _id = req.user.id

      const { privacy, username, display_name } = req.body

      const user = await User.findOne(
        { "settings.username": username },
        "_id"
      ).lean()

      if (user && user._id !== _id)
        throw this.error("This username is already taken", 403)

      const updateResult = await User.updateOne(
        { _id },
        { settings: { privacy, username }, display_name }
      )

      if (updateResult.n === 0) throw this.error("User not found", 404)

      if (updateResult.nModified === 0)
        throw this.error("Nothing to update", 400)

      return reply.send({ message: "Successfully updated" })
    }
  )
}
