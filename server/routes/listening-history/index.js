export default async function(fastify) {
  fastify.get(
    "",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            page: { type: "number", minimum: 1 },
            range: { type: "number", minimum: 1 },
            search: { type: "string" },
          },
        },
        response: {
          200: {
            type: "object",
            required: ["pages", "history", "status"],
            properties: {
              status: { type: "number" },
              pages: { type: "number" },
              history: fastify.getSchema("tracks"),
            },
          },
        },
        tags: ["pages"],
      },
    },
    async function(req, reply) {
      const _id = await fastify.auth(req);
      const range = req.query.range || 50;
      const page = req.query.page - 1 || 0;
      const search = req.query.search || "";

      const [history] = await fastify.parseHistory(_id, range, page, search);

      if (!history || !history.tracksQuantity)
        return reply.send({ pages: 0, history: [], status: 204 });

      reply.send({
        pages: Math.ceil(history.tracksQuantity / range),
        history: history.recentlyPlayed,
      });
    }
  );
}
