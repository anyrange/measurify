export default async function(fastify) {
  fastify.get("", (request, reply) => {
    reply.clearCookie("token", {
      path: "/",
      secure: true,
      sameSite: "none",
    });
    reply.send({ message: "OK", status: 200 });
  });
}
