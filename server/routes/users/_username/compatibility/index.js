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
            definitions: {
              mutualItems: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    image: { type: "string" },
                    yourPlace: { type: "number" },
                    userPlace: { type: "number" },
                  },
                },
              },
            },
            properties: {
              compatibility: { type: "number" },
              genres: { type: "array", items: { type: "string" } },
              artists: { $ref: "#/definitions/mutualItems" },
              tracks: { $ref: "#/definitions/mutualItems" },
              status: { type: "number" },
            },
          },
        },
        tags: ["user"],
      },
      preValidation: [fastify.auth],
    },
    async function (request, reply) {
      const { user, requestor: req } = request;

      if (user._id === req._id) return reply.send({ compatibility: 100 });

      const time_range = "long_term";

      const [
        { items: userArtists },
        { items: reqArtists },
        { items: userTracks },
        { items: reqTracks },
      ] = await Promise.all([
        fastify.spotifyAPI({
          route: `me/top/artists?limit=${50}&time_range=${time_range}`,
          token: user.tokens.token,
        }),
        fastify.spotifyAPI({
          route: `me/top/artists?limit=${50}&time_range=${time_range}`,
          token: req.tokens.token,
        }),
        fastify.spotifyAPI({
          route: `me/top/tracks?limit=${50}&time_range=${time_range}`,
          token: user.tokens.token,
        }),
        fastify.spotifyAPI({
          route: `me/top/tracks?limit=${50}&time_range=${time_range}`,
          token: req.tokens.token,
        }),
      ]);

      const userGenres = getGenres(userArtists, time_range);
      const reqGenres = getGenres(reqArtists, time_range);

      const genres = reqGenres.filter((genre) =>
        userGenres.find((g) => genre === g)
      );

      const artists = [];
      reqArtists.forEach((artist, reqIndex) => {
        userArtists.forEach((a, userIndex) => {
          if (artist.id !== a.id) return;
          artists.push({
            id: a.id,
            name: a.name,
            image: a.images[1]?.url || a.images[0]?.url || "",
            yourPlace: reqIndex + 1,
            userPlace: userIndex + 1,
          });
        });
      });

      const tracks = [];
      reqTracks.forEach((track, reqIndex) => {
        userTracks.forEach((t, userIndex) => {
          if (track.id !== t.id) return;
          tracks.push({
            name: t.name,
            id: t.id,
            image: t.album.images[1]?.url || t.album.images[0]?.url || "",
            yourPlace: reqIndex + 1,
            userPlace: userIndex + 1,
          });
        });
      });

      const overallGenresLength = (userGenres.length + reqGenres.length) / 2;
      const genresCompat = (genres.length / overallGenresLength) * 0.4;

      const overallArtistsLength = (userArtists.length + reqArtists.length) / 2;
      const artistsCompat = (artists.length / overallArtistsLength) * 0.6;

      const compatibility = Math.round((genresCompat + artistsCompat) * 100);

      reply.send({
        compatibility,
        genres: genres.slice(0, 5),
        artists: artists.slice(0, 5),
        tracks: tracks.slice(0, 5),
      });
    }
  );
}

const getGenres = (artists) => {
  if (!artists.length) return [];
  const genres = artists.map(({ genres }) => genres).flat(1);

  let res = genres.reduce((data, curr) => {
    data[curr] = data[curr] ? ++data[curr] : 1;
    return data;
  }, {});

  const genresTop = [];

  Object.entries(res).forEach(([val, numTimes]) => {
    genresTop.push({ genre: val, times: numTimes });
  });

  return genresTop
    .sort((a, b) => b.times - a.times)
    .map(({ genre }) => genre)
    .slice(0, 25);
};
