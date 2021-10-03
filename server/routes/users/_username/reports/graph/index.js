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
              required: ["date", "duration", "plays"],
              properties: {
                date: { type: "string", format: "date" },
                duration: { type: "number" },
                plays: { type: "number" },
              },
            },
          },
        },
        tags: ["reports"],
      },
    },
    async function (req, reply) {
      const { user } = req;
      const { firstDate, lastDate } = req.query;

      const options = { _id: user._id, firstDate, lastDate };
      reply.send(await fastify.userGraph(options));
    }
  );
}
