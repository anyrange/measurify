export default async function (fastify) {
  fastify.get(
    "",
    {
      schema: {
        response: {
          200: {
            type: "object",
            properties: {
              authenticated: { type: "boolean" },
            },
          },
        },
        tags: ["auth"],
      },
    },
    (req, reply) => {
      reply.send({ authenticated: !!req.session.get("id") });
    }
  );
}
