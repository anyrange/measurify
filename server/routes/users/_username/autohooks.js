export default async function (fastify) {
  fastify.addHook("preSerialization", async (req, reply) => {
    if (reply.statusCode === 200)
      reply.header("Cache-Control", "public, max-age=5");
  });
}
