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
                date: { type: "string", format: "datetime" },
              },
            },
          },
        },
        tags: ["user"],
      },
      preHandler: [fastify.getUserInfo],
    },
    async function (req, reply) {
      const user = req.user;
      const { firstDate, lastDate, range } = req.query;

      const userRef = fastify.db.User;

      if (!firstDate && !lastDate) {
        const data = await userRef
          .findById(user._id, { genresTimeline: { $slice: range } })
          .lean();
        reply.send(data.genresTimeline);
        return;
      }

      const agg = getAgg(user._id, firstDate, lastDate);
      const data = await userRef.aggregate(agg);

      reply.send(data[0].genresTimeline);
    }
  );
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
                { $lte: ["$$item.date", new Date(lastDate)] },
                { $gte: ["$$item.date", new Date(firstDate)] },
              ],
            },
          },
        },
      },
    },
  ];
};
