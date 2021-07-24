export default async function(fastify) {
  fastify.addHook("preSerialization", async (request, reply, payload) => {
    if (payload.status) return;
    payload.status = reply.statusCode;
  });
}
