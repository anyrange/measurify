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
    async function (req, reply) {
      const _id = req.user.id;
      const { username } = req.params;

      const [requestor, user] = await Promise.all([
        fastify.db.User.findById(_id, {
          "tokens.token": 1,
          genres: { $first: "$genresTimeline.genres" },
        }).lean(),
        fastify.db.User.findOne(
          { "settings.username": username },
          {
            "tokens.token": 1,
            "settings.privacy": 1,
            genres: { $first: "$genresTimeline.genres" },
          }
        ).lean(),
      ]);

      if (!user) throw fastify.error("User not found", 404);

      if (user._id === requestor._id) return reply.send({ compatibility: 100 });

      if (user.settings.privacy === "private")
        throw fastify.error("Private profile", 403);

      const DATA_LIMIT = 50;

      const opts1 = { _id: user._id, range: DATA_LIMIT };
      const opts2 = { _id: requestor._id, range: DATA_LIMIT };
      const [
        { artists: userArtists, tracks: userTracks },
        { artists: reqArtists, tracks: reqTracks },
      ] = await Promise.all([userTop(opts1), userTop(opts2)]);

      const artists = [];
      reqArtists.forEach((artist, reqIndex) => {
        userArtists.forEach((a, userIndex) => {
          if (artist.id !== a.id) return;
          artists.push({
            ...a,
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
            ...t,
            yourPlace: reqIndex + 1,
            userPlace: userIndex + 1,
          });
        });
      });

      const genres = requestor.genres.filter(
        (genre) => user.genres?.find((g) => genre === g) || false
      );

      const overallGenresLength = meanValue(
        user.genres?.length,
        requestor.genres?.length
      );

      const genresCompat = (genres?.length / overallGenresLength) * 0.4;

      const overallArtistsLength = meanValue(
        userArtists?.length,
        reqArtists?.length
      );

      const artistsCompat = (artists.length / overallArtistsLength) * 0.6;

      const overallTracksLength = meanValue(
        userTracks?.length,
        reqTracks?.length
      );
      const tracksCompat = tracks.length / overallTracksLength;

      const compatibility = Math.round(
        (genresCompat + artistsCompat + tracksCompat) * 100
      );

      return reply.send({
        compatibility,
        genres,
        artists: artists.slice(0, 5),
        tracks: tracks.slice(0, 5),
      });
    }
  );

  const userTop = async (options) => {
    const [t, al, art] = await Promise.all([
      fastify.userTopTracks(options),
      fastify.userTopAlbums(options),
      fastify.userTopArtists(options),
    ]);

    return {
      tracks: t.tracks,
      albums: al.albums,
      artists: art.artists,
    };
  };
}

const meanValue = (first = 0, second = 0) => (first + second) / 2;
