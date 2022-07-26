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
            page: { type: "number", minimum: 1, default: 1 },
            range: { type: "number", minimum: 1, default: 15 },
            search: { type: "string", default: "" },
          },
        },
        response: {
          200: {
            type: "object",
            required: ["pages", "history"],
            properties: {
              status: { type: "number" },
              pages: { type: "number" },
              history: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    ...fastify.getSchema("track").properties,
                    duration_ms: { type: "number" },
                    played_at: { type: "string", format: "date-time" },
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
      const { search, range, page } = req.query;
      const user = req.userInfo;

      const history = await fastify.userListeningHistory({
        _id: user._id,
        range,
        page,
        search,
      });

      return reply.send(history);
    }
  );
}
