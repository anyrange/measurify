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
            required: ["private", "customID", "spotifyID", "status"],
            properties: {
              private: { type: "boolean" },
              customID: { type: "string" },
              spotifyID: { type: "string" },
              status: {
                type: "number",
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

        const user = await User.findOne(
          { _id },
          { private: 1, customID: 1, spotifyID: 1, _id: 0 }
        );

        if (!user)
          return reply
            .code(404)
            .send({ message: "User not found", status: 404 });

        reply.code(200).send({
          private: user.private,
          customID: user.customID,
          spotifyID: user.spotifyID,
          status: 200,
        });
      } catch (e) {
        reply.code(500).send({ message: "Something went wrong!", status: 500 });
        console.log(e);
      }
    }
  );
}
