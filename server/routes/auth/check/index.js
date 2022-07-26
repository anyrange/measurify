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
      const token = req.headers.authorization?.split(" ")[1];
      return reply.send({ authenticated: !!token });
    }
  );
}
