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
        },
        tags: ["reports"],
      },
      preHandler: [fastify.getUserInfo],
    },
    async function (req, reply) {
      const user = req.user;

      const { firstDate, lastDate } = req.query;

      const options = { _id: user._id, firstDate, lastDate };
      const hourlyActivity = await fastify.userHourlyActivity(options);

      reply.send(hourlyActivity);
    }
  );
}
