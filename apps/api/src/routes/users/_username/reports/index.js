export default async function (fastify) {
  fastify.get(
    "",
    {
      schema: {
        params: {
          type: "object",
          required: ["username"],
          properties: { username: { type: "string" } },
        },

        response: {
          200: {
            type: "object",
            required: ["plays", "playtime", "meantime"],
            properties: {
              plays: { type: "number" },
              playtime: { type: "number" },
              meantime: { type: "number" },
            },
          },
        },
        tags: ["user"],
      },
      preHandler: [fastify.getUserInfo],
    },
    async function (req, reply) {
      const user = req.userInfo

      const res = await fastify.db.User.findById(user._id, {
        listened: 1,
      }).lean()

      const plays = res.listened?.count || 0
      const playtime = (res.listened?.time || 0) / 60

      return reply.send({
        plays,
        playtime: Math.round(playtime),
        meantime: (playtime / plays || 1).toFixed(2),
      })
    }
  )
}
