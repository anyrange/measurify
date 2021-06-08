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
    async (req, reply) => {
      const _id = req.user_id;

      const user = await User.findOne({ _id }, { lastSpotifyToken: 1 });

      if (!user)
        return reply.code(404).send({ message: "User not found", status: 404 });

      reply.code(200).send({ token: user.lastSpotifyToken, status: 200 });

      await User.updateOne({ _id }, { lastLogin: Date.now() });
    }
  );
}
