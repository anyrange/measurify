export default async function(fastify) {
  fastify.get("", (request, reply) => {
    reply.clearCookie("token", { path: "/" });
    reply.send({ message: "OK", status: 200 });
  });
}
