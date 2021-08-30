export default async function (fastify) {
  fastify.addHook("preValidation", fastify.auth);

  fastify.addHook("onSend", async (request, reply) => {
    if (reply.statusCode === 200)
      reply.header("Cache-Control", "public, max-age=30");
  });
}
