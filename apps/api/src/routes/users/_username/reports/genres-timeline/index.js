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
            firstDate: { type: "string", format: "date" },
            lastDate: { type: "string", format: "date" },
            range: { type: "number", default: 5 },
          },
        },
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: {
                genres: { type: "array", items: { type: "string" } },
                date: { type: "string", format: "date-time" },
              },
            },
          },
        },
        tags: ["user"],
      },
      preHandler: [fastify.getUserInfo],
    },
    async function (req, reply) {
      const user = req.userInfo
      const { firstDate, lastDate, range } = req.query

      const userRef = fastify.db.User

      if (!firstDate && !lastDate) {
        const data = await userRef
          .findById(user._id, { genresTimeline: { $slice: range } })
          .lean()
        return reply.send(data.genresTimeline)
      }

      const agg = getAgg(user._id, firstDate, lastDate)
      const [data] = await userRef.aggregate(agg)

      return reply.send(data.genresTimeline)
    }
  )
}

const getAgg = (_id, firstDate, lastDate = new Date()) => {
  return [
    { $match: { _id } },
    {
      $project: {
        genresTimeline: {
          $filter: {
            input: "$genresTimeline",
            as: "item",
            cond: {
              $and: [
                { $gte: ["$$item.date", new Date(firstDate)] },
                { $lte: ["$$item.date", new Date(lastDate)] },
              ],
            },
          },
        },
      },
    },
  ]
}
