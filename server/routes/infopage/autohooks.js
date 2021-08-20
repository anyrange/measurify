export default async function (fastify) {
  fastify.addHook("preValidation", fastify.auth);

  fastify.addHook("onSend", (request, reply, payload, next) => {
    if (reply.statusCode === 200)
      reply.header("Cache-Control", "public, max-age=20");
    next();
  });
}
