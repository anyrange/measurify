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
        querystring: {
          type: "object",
          properties: {
            range: { type: "number", minimum: 1, maximum: 50, default: 20 },
            page: { type: "number", minimum: 1, default: 1 },
            firstDate: { type: "string", format: "date" },
            lastDate: { type: "string", format: "date" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              status: { type: "number" },
              pages: { type: "number" },
              tracks: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    ...fastify.getSchema("track").properties,
                    plays: { type: "number" },
                    duration_ms: { type: "number" },
                  },
                },
              },
            },
          },
        },
        tags: ["user"],
      },
      preHandler: [fastify.getUserInfo],
    },
    async function (req, reply) {
      const { range, page, firstDate, lastDate } = req.query

      const _id = req.userInfo._id
      const options = { _id, range, page, firstDate, lastDate }

      const top = await fastify.userTopTracks(options)

      return reply.send(top)
    }
  )
}
