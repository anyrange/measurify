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

      const [token, country] = await Promise.all([
        fastify.getRandomToken(),
        fastify.getCountry(req.session.get("id")),
      ]);

      const albums = await fastify.spotifyAPI({
        route: `artists/${artistID}/albums?include_groups=album,single&market=${country}`,
        token,
      });

      reply.send(albums.items.map((artist) => addImage(artist, 1)));
    }
  );
}
