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
            required: ["pages", "history", "status"],
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
                    played_at: { type: "string", format: "datetime" },
                  },
                },
              },
            },
          },
        },
        tags: ["user"],
      },
    },
    async function (req, reply) {
      const _id = req.session.get("id");

      const { search, range, page } = req.query;

      const history = await fastify.userListeningHistory({
        _id,
        range,
        page,
        search,
      });

      reply.send(history);
    }
  );
}
