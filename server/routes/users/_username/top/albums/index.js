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
    },
    async function (req, reply) {
      const { search, range, page, firstDate, lastDate } = req.query;

      const { user } = req;
      const _id = user._id;

      if (new Date(firstDate) > new Date())
        throw fastify.error("Invalid firstDate", 400);

      const options = { _id, range, firstDate, lastDate, page, search };
      const [top] = await fastify.userTopAlbums(options);

      reply.send({
        albums: top?.albums || [],
        pages: Math.ceil((top?.items || 0) / range) || 1,
      });
    }
  );
}
