import history from "../../../includes/listening-history.js";

export default async function(fastify) {
  const responseSchema = {
    200: {
      type: "object",
      required: ["artist", "tracks", "status"],
      properties: {
        artist: {
          type: "object",
          properties: {
            followers: { type: "number" },
            genres: { type: "array", items: { type: "string" } },
            popularity: { type: "number" },
            name: { type: "string" },
            image: { type: "string" },
            link: { type: "string" },
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
      },
    },
    async function(req, reply) {
      const _id = await fastify.auth(req);
      const artistID = req.params.id;
      const token = await this.getToken(_id);

      const [artist, tracks, audioFeatures] = await Promise.all([
        fastify.spotifyAPI({ route: `artists/${artistID}`, token }),
        history(_id, artistID),
        fastify
          .spotifyAPI({
            route: `artists/${artistID}/top-tracks?market=ES`,
            token,
          })
          .then(({ tracks }) => fastify.parseAudioFeatures(tracks, token)),
      ]);

      // response schema
      const response = {
        artist: {
          followers: artist.followers.total,
          genres: artist.genres,
          popularity: artist.popularity,
          name: artist.name,
          image: artist.images.length ? artist.images[0].url : "",
          link: artist.external_urls.spotify,
        },
        tracks,
        audioFeatures,
        status: 200,
      };

      reply.code(200).send(response);
    }
  );
}
