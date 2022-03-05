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
      const albumID = req.params.id;

      const token = await fastify.getRandomToken();

      const album = await fastify.spotifyAPI({
        route: `albums/${albumID}`,
        token,
      });

      const artists = await fastify
        .spotifyAPI({
          route: `artists?ids=${album.artists.map(({ id }) => id).join(",")}`,
          token,
        })
        .then(({ artists }) => artists.map((artist) => addImage(artist, 1)));

      reply.send(artists);
    }
  );
}
