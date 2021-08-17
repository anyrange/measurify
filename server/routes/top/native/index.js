import User from "../../../models/User.js";

export default async function (fastify) {
  fastify.get(
    "",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            range: { type: "number", minimum: 0 },
            period: {
              type: "string",
              pattern: "^(long_term|medium_term|short_term)$",
            },
          },
        },
        response: {
          200: {
            type: "object",
            required: ["tracks", "artists", "status"],
            properties: {
              tracks: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    ...fastify.getSchema("track").properties,
                    genres: { type: "array", items: { type: "string" } },
                    popularity: { type: "number" },
                  },
                },
              },
              artists: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    ...fastify.getSchema("entity").properties,
                    genres: { type: "array", items: { type: "string" } },
                    popularity: { type: "number" },
                  },
                },
              },
              status: { type: "number" },
            },
          },
        },
        tags: ["pages"],
      },
    },
    async function (req, reply) {
      const { _id } = req;
      const range = req.query.range || 20;
      const period = req.query.period || "long_term";

      const user = await User.findById(_id, "lastSpotifyToken").lean();
      if (!user) throw new fastify.CustomError("User not found", 404);
      const token = user.lastSpotifyToken;

      const options = { token, range, period };
      const [tracks, artists] = await Promise.all([
        getTracks(options, fastify.spotifyAPI),
        getArtists(options, fastify.spotifyAPI),
      ]);

      reply.send({ tracks, artists });
    }
  );
}

const getTracks = async ({ token, period, range }, api) => {
  const tracks = await api({
    route: `me/top/tracks?limit=${range}&time_range=${period}`,
    token,
  });

  return tracks.items.map((track) => formatTrack(track));
};

const getArtists = async ({ token, period, range }, api) => {
  const artists = await api({
    route: `me/top/artists?limit=${range}&time_range=${period}`,
    token,
  });

  return artists.items.map((artist) => {
    return {
      name: artist.name,
      id: artist.id,
      image: artist.images.length ? artist.images[0].url : "",
      url: artist.external_urls.spotify,
      followers: artist.total,
      genres: artist.genres,
      popularity: artist.popularity,
    };
  });
};

function formatTrack(track) {
  return Object.assign(track, {
    image:
      track.album.images && track.album.images.length
        ? track.album.images[2].url
        : "",
  });
}
