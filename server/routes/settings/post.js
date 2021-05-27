/**
 * @param {import('fastify').FastifyInstance} fastify
 */

import User from "../../models/User.js";

export default async function(fastify) {
  fastify.post(
    "/",
    {
      schema: {
        body: {
          type: "object",
          required: ["private", "customID"],
          properties: {
            private: { type: "boolean" },
            customID: {
              type: "string",
              maxLength: 16,
              minLength: 3,
              pattern:
                "^(?!.*(?:overview|listening-history|about|profile|top-listeners|account|track))[a-z0-9_-]{3,16}$",
            },
          },
        },
        response: {
          XXX: {
            type: "object",
            required: ["message"],
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
      attachValidation: true,
    },
    async (req, reply) => {
      try {
        if (req.validationError)
          return reply.code(400).send({ message: "Bad data" });

        const token = req.cookies.token;
        if (!token) return reply.code(401).send({ message: "Unauthorized" });

        const _id = await fastify.auth(token);
        const confidential = req.body.private;
        const customID = req.body.customID;

        const user = await User.findOne({ customID }, { _id: 1 });

        if (user && user._id != _id)
          return reply.code(403).send({ message: "This id is already taken" });

        const updateResult = await User.updateOne(
          { _id },
          { private: confidential, customID }
        );

        if (updateResult.n === 0)
          return reply.code(404).send({ message: "User not found" });

        if (updateResult.nModified === 0)
          return reply
            .code(500)
            .send({ message: "An error occurred while updating" });

        reply.code(200).send({ message: "Successfully updated" });
      } catch (e) {
        reply.code(500).send({ message: "Something went wrong!" });
        console.log(e);
      }
    }
  );
}
