/**
 * @param {import('fastify').FastifyInstance} fastify
 */

import User from "../../models/User.js";

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
            required: ["status", "token"],
            properties: {
              status: {
                type: "number",
              },
              token: {
                type: "string",
              },
            },
          },
        },
      },
      attachValidation: true,
    },
    async (req, reply) => {
      try {
        if (req.validationError) {
          const { status, message } = fastify.validate(req.validationError);
          return reply.code(status).send({ message, status });
        }

        const _id = await fastify.auth(req.cookies.token);

        const user = await User.findOne({ _id }, { lastSpotifyToken: 1 });

        if (!user)
          return reply
            .code(404)
            .send({ message: "User not found", status: 404 });

        reply.code(200).send({ token: user.lastSpotifyToken, status: 200 });

        await User.updateOne({ _id }, { lastLogin: Date.now() });
      } catch (e) {
        reply.code(500).send({ message: "Something went wrong!", status: 500 });
        console.log(e);
      }
    }
  );
}
