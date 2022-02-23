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
          200: { $ref: "overview#" },
        },
        tags: ["reports"],
      },
    },
    async function (req, reply) {
      const _id = req.session.get("id");

      const { firstDate, lastDate } = req.query;

      const options = { _id, firstDate, lastDate };
      const overview = await fastify.userOverview(options);

      reply.send(overview);
    }
  );
}
