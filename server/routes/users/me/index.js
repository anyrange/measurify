import User from "../../../models/User.js";

export default async function (fastify) {
  fastify.get(
    "",
    {
      schema: {
        response: {
          200: {
            type: "object",
            properties: {
              status: { type: "number" },
              lastSpotifyToken: { type: "string" },
              avatar: { type: "string" },
              userName: { type: "string" },
              customID: { type: "string" },
              country: { type: "string" },
              autoUpdate: { type: "boolean" },
            },
          },
        },
        tags: ["users"],
      },
      preValidation: [fastify.auth],
    },
    async function (req, reply) {
      const { _id } = req;

      const user = await User.findByIdAndUpdate(_id, { lastLogin: Date.now() })
        .select("lastSpotifyToken autoUpdate userName customID country avatar")
        .lean();

      reply.send(user);
    }
  );
}
