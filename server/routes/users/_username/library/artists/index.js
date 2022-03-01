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
            page: { type: "number", minimum: 1, default: 1 },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              status: { type: "number" },
              artists: { $ref: "topItems#" },
              pages: { type: "number" },
            },
          },
        },
        tags: ["user"],
      },
      preHandler: [fastify.getUserInfo],
    },
    async function (req, reply) {
      const { range, page } = req.query;

      const _id = req.session.get("id");

      const top = await fastify.userTopArtists({ _id, range, page });

      reply.send(top);
    }
  );
}
