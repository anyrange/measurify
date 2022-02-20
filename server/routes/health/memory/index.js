export default async function (fastify) {
  fastify.get(
    "",
    {
      schema: {
        response: {
          200: {
            type: "object",
            properties: {
              heapUsed: { type: "number" },
              rss: { type: "number" },
              heapTotal: { type: "number" },
              external: { type: "number" },
              date: { type: "string", format: "datetime" },
            },
          },
        },
        tags: ["server"],
      },
    },
    (req, res) => {
      const { heapUsed, rss, heapTotal, external } = process.memoryUsage();

      res.send({
        heapUsed,
        rss,
        heapTotal,
        external,
        date: new Date(),
      });
    }
  );
}
