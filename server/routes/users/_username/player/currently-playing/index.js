export default async function (fastify) {
  fastify.get(
    "",
    {
      schema: {
        params: {
          type: "object",
          required: ["username"],
          properties: { username: { type: "string" } },
        },
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
        tags: ["user"],
      },
    },
    async function (req, reply) {
      const { user } = req;

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
