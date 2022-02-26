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
          },
        },
        response: {
          200: { $ref: "top" },
        },
        tags: ["user"],
      },
      preHandler: [fastify.getUserInfo],
    },
    async function (req, reply) {
      const { range } = req.query;
      const user = req.user;

      const top = await fastify.userTop({ _id: user._id, range });

      reply.send(top);
    }
  );
}
