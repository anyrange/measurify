/**
 * @param {import('fastify').FastifyInstance} fastify
 */

import User from "../../models/User.js";

export default async function(fastify) {
  const auth = fastify.getSchema("auth");
  fastify.post(
    "/",
    {
      schema: {
        headers: auth,
        body: {
          type: "object",
          required: ["private", "customID"],
          properties: {
            private: { type: "boolean" },
            customID: { type: "string", maxLength: 16, minLength: 3 },
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
        if (req.validationError) {
          const errorSource = req.validationError.validationContext;

          errorSource === "headers" &&
            reply.code(401).send({ message: "Unauthorized" });

          errorSource === "body" &&
            reply.code(400).send({ message: "Bad data" });

          return;
        }

        const _id = req.headers.authorization;
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
