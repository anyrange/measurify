import formatTrack from "#server/utils/format-track.js";

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
          200: {
            type: "object",
            required: ["tracks", "artists", "status"],
            properties: {
              tracks: { $ref: "tracks#" },
              artists: { $ref: "entities#" },
              status: { type: "number" },
            },
          },
        },
        tags: ["user"],
      },
    },
    async function (req, reply) {
      const { user } = req;
      const { range, period } = req.query;

      const token = user.tokens.token;
      const options = { token, range, period };

      const [tracks, artists] = await Promise.all([
        getTracks(options),
        getArtists(options),
      ]);

      reply.send({ tracks, artists });
    }
  );

  const getTracks = async ({ token, period, range }) => {
    const tracks = await fastify.spotifyAPI({
      route: `me/top/tracks?limit=${range}&time_range=${period}`,
      token,
    });

    return tracks.items.map((track) => formatTrack(track));
  };

  const getArtists = async ({ token, period, range }) => {
    const artists = await fastify.spotifyAPI({
      route: `me/top/artists?limit=${range}&time_range=${period}`,
      token,
    });

    return artists.items.map((artist) => ({
      name: artist.name,
      id: artist.id,
      image: artist.images[0]?.url || "",
    }));
  };
}
