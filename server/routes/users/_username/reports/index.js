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
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              status: { type: "number" },
              hourlyActivity: {
                type: "array",
                items: {
                  type: "object",
                  required: ["time", "playtime", "plays"],
                  properties: {
                    time: { type: "number" },
                    playtime: { type: "number" },
                    plays: { type: "number" },
                  },
                },
              },
              graph: {
                type: "array",
                items: {
                  type: "object",
                  required: ["date", "duration", "plays"],
                  properties: {
                    date: { type: "string", format: "date" },
                    duration: { type: "number" },
                    plays: { type: "number" },
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
      const user = req.user;
      const { firstDate, lastDate } = req.query;

      const options = { _id: user._id, firstDate, lastDate };

      const [graph, hourlyActivity] = await Promise.all([
        fastify.userGraph(options),
        fastify.userHourlyActivity(options),
      ]);

      reply.send({ graph, hourlyActivity });
    }
  );
}
