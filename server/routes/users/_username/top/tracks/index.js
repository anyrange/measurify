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
              pages: { type: "number" },
              tracks: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    ...fastify.getSchema("track").properties,
                    plays: { type: "number" },
                    duration_ms: { type: "number" },
                  },
                },
              },
            },
          },
        },
        tags: ["top"],
      },
      preHandler: [fastify.getUserInfo],
    },
    async function (req, reply) {
      const { range, page } = req.query;
      const user = req.user;

      const top = await fastify.userTopTracks({ _id: user._id, range, page });

      reply.send({
        pages: top?.pages,
        tracks: top?.tracks || [],
      });
    }
  );
}
