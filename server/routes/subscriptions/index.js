import User from "../../models/User.js";
export default async function(fastify) {
  fastify.get(
    "",
    {
      schema: {
        response: {
          200: {
            type: "object",
            required: ["subscriptions", "status"],
            properties: {
              subscriptions: {
                type: "array",
                items: { type: "string" },
              },
              status: { type: "number" },
            },
          },
        },
      },
    },
    async function(req, reply) {
      const _id = await fastify.auth(req);
      const { subscriptions } = await User.findOne(
        { _id },
        { subscriptions: 1 }
      );

      reply.send({ subscriptions: Object.keys(subscriptions), status: 200 });
    }
  );
}
