export default async function (fastify) {
  fastify.addHook("onSend", async (request, reply) => {
    if (reply.statusCode === 200)
      reply.header("Cache-Control", "public, max-age=30")
  })
  fastify.get(
    "",
    {
      schema: {
        response: {
          200: {
            type: "object",
            properties: {
              users: {
                type: "object",
                properties: {
                  total: { type: "number" },
                  active: { type: "number" },
                  inactive: { type: "number" },
                },
              },
              tracks: { type: "number" },
              albums: { type: "number" },
              artists: { type: "number" },
            },
          },
        },
        tags: ["other"],
      },
    },
    async function (req, reply) {
      const [users, activeUsers, tracks, albums, artists] = await Promise.all([
        fastify.db.User.estimatedDocumentCount(),
        fastify.db.User.find(
          { "tokens.refreshToken": { $ne: "" } },
          "_id"
        ).countDocuments(),
        fastify.db.Track.estimatedDocumentCount(),
        fastify.db.Album.estimatedDocumentCount(),
        fastify.db.Artist.estimatedDocumentCount(),
      ])
      return reply.send({
        users: {
          total: users,
          active: activeUsers,
          inactive: users - activeUsers,
        },
        tracks,
        albums,
        artists,
      })
    }
  )
}
