export default async function(fastify) {
  const history = fastify.getSchema("listening-history");
  const headers = fastify.getSchema("cookie");
  const schema = {
    querystring: {
      type: "object",
      properties: {
        page: {
          type: "number",
          minimum: 1,
        },
        range: {
          type: "number",
          minimum: 1,
        },
        search: {
          type: "string",
        },
      },
    },
    headers,
    response: {
      200: {
        type: "object",
        required: ["pages", "history", "status"],
        properties: {
          status: {
            type: "number",
          },
          pages: {
            type: "number",
          },
          history,
        },
      },
    },
  };

  fastify.get(
    "",
    {
      schema,
    },
    async (req, reply) => {
      const _id = req.user_id;
      const range = req.query.range || 50;
      const page = req.query.page - 1 || 0;
      const search = req.query.search || "";

      const user = await fastify.parseHistory(_id, range, page, search);

      if (!user[0] || !user[0].tracksQuantity)
        return reply.code(200).send({ pages: 0, history: [], status: 204 });

      reply.code(200).send({
        pages: Math.ceil(user[0].tracksQuantity / range),
        history: user[0].recentlyPlayed,
        status: 200,
      });
    }
  );
}
