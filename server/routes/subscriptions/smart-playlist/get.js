import User from "../../../models/User.js";
export default async function(fastify) {
  const headers = fastify.getSchema("cookie");
  fastify.get(
    "/",
    {
      schema: {
        headers,
        response: {
          200: {
            type: "object",
            required: ["items", "status"],
            properties: {
              items: {
                type: "array",
                items: {
                  type: "string",
                  minLength: 22,
                  maxLength: 22,
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
          { "subscriptions.smartPlaylist": 1 }
        );

        if (!subscriptions?.smartPlaylist)
          return reply.code(200).send({ items: [], status: 204 });

        reply
          .code(200)
          .send({ items: subscriptions.smartPlaylist, status: 200 });
      } catch (e) {
        reply.code(500).send({ message: "Something went wrong!", status: 500 });
        console.log(e);
      }
    }
  );
}
