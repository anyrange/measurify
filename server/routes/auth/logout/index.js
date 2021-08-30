export default async function (fastify) {
  fastify.get("", { schema: { tags: ["auth"] } }, (req, reply) => {
    req.session.delete();
    reply.code(204).send();
  });
}
