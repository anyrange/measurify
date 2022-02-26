import { arrLastEl } from "#server/utils/index.js";

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
          200: fastify.getSchema("tracks").definitions.withDuration,
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

      reply.send(
        album.tracks.items.map((track) => ({
          ...track,
          image: arrLastEl(album.images).url || "",
        }))
      );
    }
  );
}
