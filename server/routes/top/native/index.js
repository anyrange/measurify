export default async function(fastify) {
  const response = {
    200: {
      type: "object",
      required: ["tracks", "artists", "status"],
      properties: {
        tracks: {
          type: "array",
          items: fastify.getSchema("track"),
        },
        artists: fastify.getSchema("artists"),
        status: { type: "number" },
      },
    },
  };

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
        response,
      },
    },
    async function(req, reply) {
      const _id = await fastify.auth(req);
      const range = req.query.range || 20;
      const period = req.query.period || "long_term";

      const token = await this.getToken(_id);

      const options = { token, range, period };
      const [tracks, artists] = await Promise.all([
        getTracks(options, fastify.spotifyAPI),
        getArtists(options, fastify.spotifyAPI),
      ]);

      reply.send({ tracks, artists, status: 200 });
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
  if (!track) return;

  const album = {
    id: track.album.id,
    name: track.album.name,
  };

  const artists = track.artists.map(({ id, name }) => {
    return { id, name };
  });

  return {
    id: track.id,
    name: track.name,
    duration_ms: track.duration_ms,
    popularity: track.popularity,
    image:
      track.album.images && track.album.images.length
        ? track.album.images[2].url
        : "",
    album,
    artists,
  };
}
