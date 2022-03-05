import { formatTrack } from "#server/utils/index.js";

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
      const trackID = req.params.id;

      const token = await fastify.getRandomToken();

      const track = await fastify.spotifyAPI({
        route: `tracks/${trackID}`,
        token,
      });

      const { tracks: moreTracks } = await fastify.spotifyAPI({
        route: `artists/${track.artists[0].id}/top-tracks?market=US`,
        token,
      });

      reply.send(moreTracks.map((track) => formatTrack(track)));
    }
  );
}
