import { addImage } from "#server/utils/index.js";

export default async function (fastify) {
  fastify.get(
    "",
    {
      schema: {
        params: {
          type: "object",
          required: ["id"],
          properties: { id: { type: "string", minLength: 22, maxLength: 22 } },
        },
        response: {
          200: { $ref: "entities#" },
        },
        tags: ["infopages"],
      },
    },
    async function (req, reply) {
      const artistID = req.params.id;

      const token = await fastify.getRandomToken();

      const relatedArtists = await fastify.spotifyAPI({
        route: `artists/${artistID}/related-artists`,
        token,
      });

      reply.send(relatedArtists.artists.map((artist) => addImage(artist, 1)));
    }
  );
}
