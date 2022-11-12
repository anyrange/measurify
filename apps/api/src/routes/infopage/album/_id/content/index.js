import { arrLastEl } from "#src/utils/index.js"

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
      const albumID = req.params.id
      const id = await fastify.getId(req)
      const [token, country] = await Promise.all([
        fastify.getRandomToken(),
        fastify.getCountry(id),
      ])

      const album = await fastify.spotifyAPI({
        route: `albums/${albumID}?market=${country}`,
        token,
      })

      return reply.send(
        album.tracks.items.map((track) => ({
          ...track,
          image: arrLastEl(album.images).url || "",
        }))
      )
    }
  )
}
