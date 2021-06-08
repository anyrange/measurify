import User from "../../models/User.js";

export default async function(fastify) {
  const headers = fastify.getSchema("cookie");

  fastify.post(
    "",
    {
      schema: {
        headers,
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
            required: ["message", "status"],
            properties: {
              message: { type: "string" },
              status: {
                type: "number",
              },
            },
          },
        },
      },
    },
    async (req, reply) => {
      const _id = req.user_id;
      const confidential = req.body.private;
      const customID = req.body.customID;

      const user = await User.findOne({ customID }, { _id: 1 });

      if (user && user._id != _id)
        return reply
          .code(403)
          .send({ message: "This id is already taken", status: 403 });

      const updateResult = await User.updateOne(
        { _id },
        { private: confidential, customID }
      );

      if (updateResult.n === 0)
        return reply.code(404).send({ message: "User not found", status: 404 });

      if (updateResult.nModified === 0)
        return reply
          .code(500)
          .send({ message: "Nothing to update", status: 500 });

      reply.code(200).send({ message: "Successfully updated", status: 200 });
    }
  );
}
