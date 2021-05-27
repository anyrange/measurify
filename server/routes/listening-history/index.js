/**
 * @param {import('fastify').FastifyInstance} fastify
 * @param {*} opts
 */

export default async function(fastify) {
  const history = fastify.getSchema("listening-history");
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
      },
    },
    response: {
      200: history,
    },
  };

  fastify.get(
    "/",
    {
      schema,
      attachValidation: true,
    },
    async (req, reply) => {
      try {
        if (req.validationError)
          return reply.code(417).send({ message: "Invalid parameters" });

        const token = req.cookies.token;
        if (!token) return reply.code(401).send({ message: "Unauthorized" });

        const _id = await fastify.auth(token);
        const range = req.query.range || 50;
        const page = req.query.page - 1 || 0;

        const user = await fastify.parseHistory(_id, range, page);

        if (!user[0])
          return reply.code(404).send({ message: "User not found" });

        if (!user[0].tracksLength) return reply.code(204).send({});

        reply.code(200).send({
          pages: Math.ceil(user[0].tracksLength / range),
          history: user[0].recentlyPlayed,
        });
      } catch (e) {
        reply.code(500).send({ message: "Something went wrong!" });
        console.log(e);
      }
    }
  );
}
