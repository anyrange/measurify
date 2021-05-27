/**
 * @param {import('fastify').FastifyInstance} fastify
 */

import User from "../../models/User.js";

export default async function(fastify) {
  fastify.get(
    "/",
    {
      schema: {
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
        const token = req.cookies.token;
        if (!token)
          return reply.code(401).send({ message: "Unauthorized", status: 401 });

        const _id = await fastify.auth(token);

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
