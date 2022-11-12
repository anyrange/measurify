export default async function (fastify) {
  fastify.post(
    "",
    {
      schema: {
        query: {
          type: "object",
          required: ["username"],
          properties: {
            username: { type: "string" },
          },
        },
        tags: ["follow"],
      },
    },
    async function (req, reply) {
      const _id = req.user.id
      const username = req.query.username

      const user = await fastify.db.User.findOne(
        { "settings.username": username },
        "_id followers"
      )

      if (!user) return reply.code(404).send({ message: "User not found" })

      const userID = user._id

      if (userID === _id)
        return reply.code(400).send({ message: "You can't follow yourself" })

      if (user.followers.includes(_id))
        return reply
          .code(400)
          .send({ message: "You are already following this user" })

      await Promise.all([
        fastify.db.User.updateOne({ _id }, { $push: { follows: userID } }),
        fastify.db.User.updateOne(
          { _id: userID },
          { $push: { followers: _id } }
        ),
      ])

      return reply.code(204).send()
    }
  )
}
