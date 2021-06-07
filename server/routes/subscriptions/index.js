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
      attachValidation: true,
    },
    async function(req, reply) {
      try {
        if (req.validationError) {
          const { status, message } = fastify.validate(req.validationError);
          return reply.code(status).send({ message, status });
        }

        const _id = await fastify.auth(req.cookies.token);

        const { subscriptions } = await User.findOne(
          { _id },
          { subscriptions: 1 }
        );

        reply
          .code(200)
          .send({ subscriptions: Object.keys(subscriptions), status: 200 });
      } catch (e) {
        reply.code(500).send({ message: "Something went wrong!", status: 500 });
        console.log(e);
      }
    }
  );
}
