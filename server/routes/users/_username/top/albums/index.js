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
            firstDate: { type: "string", format: "date" },
            lastDate: { type: "string", format: "date" },
            page: { type: "number", minimum: 1, default: 1 },
            search: { type: "string", default: "" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              status: { type: "number" },
              albums: { $ref: "topItems#" },
              pages: { type: "number" },
            },
          },
        },
        tags: ["top"],
      },
      preHandler: [fastify.getUserInfo],
    },
    async function (req, reply) {
      const { range, page } = req.query;

      const _id = req.session.get("id");

      const options = { _id, range, page };
      const top = await fastify.userTopAlbums(options);

      reply.send(top);
    }
  );
}
