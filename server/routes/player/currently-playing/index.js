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
      const id = req.session.get("id");

      const user = await fastify.db.User.findById(
        id,
        "tokens.token country"
      ).lean();

      const currentPlayer = await fastify.spotifyAPI({
        route: `me/player/currently-playing?market=${user.country}`,
        token: user.tokens.token,
      });

      reply.send({
        track: Object.assign(currentPlayer.item, {
          image: currentPlayer.item.album.images[0].url || "",
        }),
      });
    }
  );
}
