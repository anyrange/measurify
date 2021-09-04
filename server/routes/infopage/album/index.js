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
            properties: {
              album: { $ref: "album#" },
              popularity: { type: "number" },
              release_date: { type: "string" },
              total_tracks: { type: "number" },
              label: { type: "string" },
              genres: { type: "array", items: { type: "string" } },
              isLiked: { type: "boolean" },
              favouriteTracks: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    ...fastify.getSchema("track").properties,
                    duration_ms: { type: "number" },
                    lastPlayedAt: { type: "string", format: "datetime" },
                    plays: { type: "number" },
                  },
                },
              },
              audioFeatures: { $ref: "audioFeatures#" },
              content: { $ref: "tracks#/definitions/withDuration" },
              status: { type: "number" },
            },
          },
        },
        tags: ["infopages"],
      },
    },
    async function (req, reply) {
      const id = req.session.get("id");
      const albumID = req.params.id;

      const user = await fastify.db.User.findById(id, "tokens.token").lean();

      if (!user) throw fastify.error("User not found", 404);
      const token = user.tokens.token;

      const requests = [
        fastify
          .spotifyAPI({ route: `albums/${albumID}`, token })
          .then(async (album) => {
            [album.audioFeatures, album.artists] = await Promise.all([
              fastify.parseAudioFeatures(
                album.tracks.items.map(({ id }) => id),
                token
              ),
              fastify
                .spotifyAPI({
                  route: `artists?ids=${album.artists
                    .map(({ id }) => id)
                    .join(",")}`,
                  token,
                })
                .then(({ artists }) =>
                  artists.map((artist) => ({
                    id: artist.id,
                    image: artist.images[1].url || artist.images[0].url || "",
                    name: artist.name,
                  }))
                ),
            ]);
            return album;
          }),
        fastify.spotifyAPI({
          route: `me/albums/contains?ids=${albumID}`,
          token,
        }),
        fastify.favouriteTracks({
          _id: id,
          filterID: albumID,
          type: "album",
        }),
      ];

      const [fullInfo, [isLiked], favouriteTracks] = await Promise.all(
        requests
      );
      fullInfo.audioFeatures.popularity = fullInfo.popularity / 100;

      const response = {
        album: {
          artists: fullInfo.artists,
          id: fullInfo.id,
          name: fullInfo.name,
          image: fullInfo.images[0]?.url || "",
        },
        popularity: fullInfo.popularity,
        release_date: fullInfo.release_date,
        total_tracks: fullInfo.total_tracks,
        genres: fullInfo.genres,
        label: fullInfo.label || "",
        content: fullInfo.tracks.items,
        audioFeatures: fullInfo.audioFeatures,
        isLiked,
        favouriteTracks,
      };

      reply.send(response);
    }
  );
}
