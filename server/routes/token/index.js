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
    },
    async function(req, reply) {
      const _id = req.user_id;
      const token = await this.getToken(_id);

      reply.code(200).send({ token, status: 200 });

      await User.updateOne({ _id }, { lastLogin: Date.now() });
    }
  );
}
