export default async function(fastify) {
  fastify.get(
    "",
    {
      schema: {
        response: {
          200: { type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    () => {
      return { message: "I'm alive" };
    }
  );
}
