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
        querystring: {
          type: "object",
          properties: {
            range: { type: "number", minimum: 1, default: 20 },
            period: {
              type: "string",
              pattern: "^(long_term|medium_term|short_term)$",
              default: "long_term",
            },
          },
        },
        response: {
          200: { $ref: "entities#" },
        },
        tags: ["top"],
      },
    },
    async function (req, reply) {
      const { user } = req;
      const { range, period } = req.query;

      const artists = await fastify.spotifyAPI({
        route: `me/top/artists?limit=${range}&time_range=${period}`,
        token: user.tokens.token,
      });

      reply.send(
        artists.items.map((artist) => ({
          id: artist.id,
          name: artist.name,
          image: artist.images[0]?.url || "",
        }))
      );
    }
  );
}
