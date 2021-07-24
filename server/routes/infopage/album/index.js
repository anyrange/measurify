import history from "../../../includes/listening-history.js";
export default async function(fastify) {
  const responseSchema = {
    200: {
      type: "object",
      required: ["album", "tracks", "status"],
      properties: {
        album: {
          type: "object",
          properties: {
            name: { type: "string" },
            image: { type: "string" },
            popularity: { type: "number" },
            release_date: { type: "string" },
            total_tracks: { type: "number" },
            link: { type: "string" },
            label: { type: "string" },
            genres: { type: "array", items: { type: "string" } },
            artists: fastify.getSchema("artists"),
          },
        },
        tracks: fastify.getSchema("tracks"),
        audioFeatures: fastify.getSchema("audioFeatures"),
        status: { type: "number" },
      },
    },
  };

  fastify.get(
    "/:id",
    {
      schema: {
        params: {
          type: "object",
          required: ["id"],
          properties: { id: { type: "string", minLength: 22, maxLength: 22 } },
        },
        response: responseSchema,
        tags: ["infopages"],
      },
    },
    async function(req, reply) {
      const _id = await fastify.auth(req);
      const albumID = req.params.id;

      const token = await this.getToken(_id);

      const [album, tracks, audioFeatures] = await Promise.all([
        fastify.spotifyAPI({
          route: `albums/${albumID}`,
          token,
        }),
        history(_id, albumID),
        fastify
          .spotifyAPI({ route: `albums/${albumID}/tracks`, token })
          .then(({ items }) => fastify.parseAudioFeatures(items, token)),
      ]);

      const { artists } = await fastify.spotifyAPI({
        route: `artists?ids=${album.artists.map(({ id }) => id).join(",")}`,
        token: token,
      });

      const response = {
        album: {
          name: album.name,
          image: album.images.length ? album.images[0].url : "",
          popularity: album.popularity,
          release_date: album.release_date,
          total_tracks: album.total_tracks,
          link: album.external_urls.spotify,
          genres: album.genres,
          artists: artists.map(({ name, id, images }) => {
            return { name, id, image: images.length ? images[0].url : "" };
          }),
          label: album.label || "",
        },
        audioFeatures,
        tracks,
        status: 200,
      };

      reply.code(200).send(response);
    }
  );
}
