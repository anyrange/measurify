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
              track: {
                type: "object",
                properties: {
                  ...fastify.getSchema("track").properties,
                  duration_ms: { type: "number" },
                  played_at: { type: "string", format: "date" },
                },
              },
              status: { type: "number" },
            },
          },
        },
        tags: ["other"],
      },
      preValidation: [fastify.auth],
    },
    async function (req, reply) {
      const { _id } = req;

      const { lastSpotifyToken, country } = await User.findById(
        _id,
        "lastSpotifyToken country"
      ).lean();

      const currentPlayer = await fastify.spotifyAPI({
        route: `me/player/currently-playing?market=${country}`,
        token: lastSpotifyToken,
      });

      reply.send({ track: currentPlayer.item });
    }
  );
}
