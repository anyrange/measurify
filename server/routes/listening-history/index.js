/**
 * @param {import('fastify').FastifyInstance} fastify
 * @param {*} opts
 */

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
      attachValidation: true,
    },
    async (req, reply) => {
      try {
        if (req.validationError) {
          const { status, message } = fastify.validate(req.validationError);
          return reply.code(status).send({ message, status });
        }

        const _id = await fastify.auth(req.cookies.token);
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
      } catch (e) {
        reply.code(500).send({ message: "Something went wrong!", status: 500 });
        console.log(e);
      }
    }
  );
}
