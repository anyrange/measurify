import User from "../../models/User.js";
export default async function(fastify) {
  fastify.get(
    "/",
    {
      schema: {
        response: {
          200: {
            type: "object",
            required: ["quantity", "status"],
            properties: {
              quantity: {
                type: "number",
              },
              status: {
                type: "number",
              },
            },
          },
        },
      },
    },
    async function(request, reply) {
      try {
        const quantity = await User.estimatedDocumentCount();
        reply.code(200).send({ quantity, status: 200 });
      } catch (e) {
        reply.code(500).send({ message: "Something went wrong!", status: 500 });
        console.log(e);
      }
    }
  );
}
