export default async function (fastify) {
  fastify.get(
    "/:id",
    {
      schema: {
        params: {
          type: "object",
          required: ["id"],
          properties: { id: { type: "string", minLength: 22, maxLength: 22 } },
        },
        response: {
          200: {
            type: "object",
            definitions: {
              tracksInTop: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    place: { type: "number" },
                    id: { type: "string" },
                  },
                },
              },
            },
            properties: {
              artist: { $ref: "entity#" },
              followers: { type: "number" },
              genres: { type: "array", items: { type: "string" } },
              popularity: { type: "number" },
              isLiked: { type: "boolean" },
              audioFeatures: { $ref: "audioFeatures#" },
              rates: {
                type: "object",
                properties: {
                  art: { $ref: "rates#" },
                  trc: {
                    type: "object",
                    properties: {
                      LT: { $ref: "#/definitions/tracksInTop" },
                      MT: { $ref: "#/definitions/tracksInTop" },
                      ST: { $ref: "#/definitions/tracksInTop" },
                    },
                  },
                },
              },
              relatedArtists: { $ref: "entities#" },
              favouriteTracks: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    ...fastify.getSchema("track").properties,
                    lastPlayedAt: { type: "string" },
                    duration_ms: { type: "number" },
                    plays: { type: "number" },
                  },
                },
              },
              status: { type: "number" },
            },
          },
        },
        tags: ["infopages"],
      },
    },
    async function (req, reply) {
      const _id = req.session.get("id");
      const artistID = req.params.id;

      const user = await fastify.db.User.findById(
        _id,
        "tokens.token country"
      ).lean();
      if (!user) throw fastify.error("User not found", 404);

      const time_range = ["long_term", "medium_term", "short_term"];
      const token = user.tokens.token;

      const request = [
        fastify.spotifyAPI({ route: `artists/${artistID}`, token }),
        fastify
          .spotifyAPI({
            route: `artists/${artistID}/top-tracks?market=${user.country}`,
            token,
          })
          .then(({ tracks }) =>
            fastify.parseAudioFeatures(
              tracks.map((track) => track.id),
              token
            )
          ),
        ...time_range.map((range) =>
          fastify.spotifyAPI({
            route: `me/top/artists?limit=30&time_range=${range}`,
            token,
          })
        ),
        ...time_range.map((range) =>
          fastify.spotifyAPI({
            route: `me/top/tracks?limit=50&time_range=${range}`,
            token,
          })
        ),
        fastify.spotifyAPI({
          route: `me/following/contains?type=artist&ids=${artistID}`,
          token,
        }),
        fastify.spotifyAPI({
          route: `artists/${artistID}/related-artists`,
          token,
        }),
        fastify.favouriteTracks({ _id, filterID: artistID, type: "artist" }),
      ];

      const [
        artist,
        audioFeatures,
        artLT,
        artMT,
        artST,
        trcLT,
        trcMT,
        trcST,
        [isLiked],
        { artists: relatedArtists },
        favouriteTracks,
      ] = await Promise.all(request);

      const rates = {
        art: {
          LT: findPlace(artist.name, artLT),
          MT: findPlace(artist.name, artMT),
          ST: findPlace(artist.name, artST),
        },
        trc: {
          LT: findTracks(artist.name, trcLT),
          MT: findTracks(artist.name, trcMT),
          ST: findTracks(artist.name, trcST),
        },
      };
      audioFeatures.popularity = artist.popularity / 100;

      // response schema
      const response = {
        artist: {
          id: artist.id,
          name: artist.name,
          image: artist.images.length ? artist.images[0].url : "",
        },
        followers: artist.followers.total,
        genres: artist.genres,
        popularity: artist.popularity,
        isLiked,
        relatedArtists: relatedArtists.map(({ images, name, id }) => ({
          image: images.length ? images[0].url : "",
          name,
          id,
        })),
        favouriteTracks,
        audioFeatures,
        rates,
      };

      reply.send(response);
    }
  );
}

const findPlace = (name, { items }) => {
  for (let i = 0; i < items.length; i++) {
    if (items[i].name == name) return i + 1;
  }
  return 0;
};

const findTracks = (name, { items }) => {
  const tracksInTop = [];
  items.forEach((track, index) =>
    track.artists.forEach((artist) => {
      if (artist.name == name)
        tracksInTop.push({ name: track.name, place: index + 1, id: track.id });
    })
  );
  return tracksInTop;
};
