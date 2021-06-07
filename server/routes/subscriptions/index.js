import User from "../../models/User.js";
export default async function(fastify) {
  const headers = fastify.getSchema("cookie");
  fastify.get(
    "",
    {
      schema: {
        headers,
        response: {
          200: {
            type: "object",
            required: ["subscriptions", "status"],
            properties: {
              subscriptions: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              status: {
                type: "number",
              },
            },
          },
        },
      },
    },
    async function(req, reply) {
      const _id = await fastify.auth(req.cookies.token);

      const { subscriptions } = await User.findOne(
        { _id },
        { subscriptions: 1 }
      );

      reply
        .code(200)
        .send({ subscriptions: Object.keys(subscriptions), status: 200 });
    }
  );
}
