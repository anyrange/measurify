import User from "../../models/User.js";
export default async function(fastify) {
  fastify.get(
    "",
    {
      schema: {
        response: {
          200: {
            type: "object",
            required: ["quantity", "status"],
            properties: {
              quantity: { type: "number" },
              status: { type: "number" },
            },
          },
        },
      },
    },
    async function() {
      const quantity = await User.estimatedDocumentCount();
      return { quantity, status: 200 };
    }
  );
}
