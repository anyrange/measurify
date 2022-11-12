export default async function (fastify) {
  fastify.get(
    "",
    {
      schema: {
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: {
                username: { type: "string" },
                avatar: { type: "string" },
                display_name: { type: "string" },
                lastLogin: { type: "string", format: "date-time" },
                listened: {
                  type: "object",
                  properties: {
                    count: { type: "number" },
                    time: { type: "number" },
                  },
                },
              },
            },
          },
        },
        tags: ["users"],
      },
    },
    async function (req, reply) {
      const top = await fastify.db.User.find(
        {
          "settings.privacy": "public",
          listeningHistory: { $exists: true, $type: "array", $ne: [] },
        },
        {
          "listened.count": 1,
          "listened.time": {
            $round: {
              $divide: ["$listened.time", 60],
            },
          },
          display_name: 1,
          avatar: 1,
          lastLogin: 1,
          username: "$settings.username",
        }
      ).lean()

      return reply.send(top)
    }
  )
}
