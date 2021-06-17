export default async function(fastify) {
  const headers = fastify.getSchema("cookie");
  fastify.get(
    "",
    {
      schema: {
        headers,
      },
    },
    (request, reply) => {
      reply.clearCookie("token", { path: "/" });
      reply.send({ message: "OK", status: 200 });
    }
  );
}
