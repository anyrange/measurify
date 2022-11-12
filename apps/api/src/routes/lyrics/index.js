import { getLyrics } from "genius-lyrics-api"

export default async function (fastify) {
  fastify.get(
    "",
    {
      schema: {
        query: {
          type: "object",
          required: ["title", "artist"],
          properties: {
            title: { type: "string" },
            artist: { type: "string" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              lyrics: { type: "string" },
              status: { type: "number" },
            },
          },
        },
        tags: ["other"],
      },
    },
    async function (req, reply) {
      const { artist, title } = req.query
      const GENIUS_API_SECRET_KEY = process.env.GENIUS_API_SECRET_KEY

      const lyrics = await getLyrics({
        apiKey: GENIUS_API_SECRET_KEY,
        title: title,
        artist: artist,
        optimizeQuery: true,
      })

      return reply
        .header("Cache-Control", "public, max-age=600")
        .send({ lyrics })
    }
  )
}
