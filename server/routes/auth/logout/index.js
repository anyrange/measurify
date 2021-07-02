export default async function(fastify) {
  fastify.get("", (request, reply) => {
    reply.clearCookie("token", fastify.cookieOptions);
    reply.send({ message: "OK", status: 200 });
  });
}
