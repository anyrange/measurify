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
            properties: {
              quantity: {
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
        reply.code(200).send({ quantity });
      } catch (e) {
        reply.code(500).send({ message: "Something went wrong!" });
        console.log(e);
      }
    }
  );
}
