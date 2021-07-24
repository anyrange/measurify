export default async function(fastify) {
  fastify.get(
    "",
    {
      schema: {
        response: {
          200: { type: "object", properties: { message: { type: "string" } } },
        },
        tags: ["server status"],
      },
    },
    () => {
      return { message: "I'm alive" };
    }
  );
}
