import { addImage } from "#src/utils/index.js"

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
      const artistID = req.params.id
      const id = await fastify.getId(req)
      const [token, country] = await Promise.all([
        fastify.getRandomToken(),
        fastify.getCountry(id),
      ])

      const albums = await fastify.spotifyAPI({
        route: `artists/${artistID}/albums?include_groups=album,single&market=${country}`,
        token,
      })

      return reply.send(albums.items.map((artist) => addImage(artist, 1)))
    }
  )
}
