import { addAlbum } from "#src/includes/cron-workers/historyParser/albums.js"
import { timeDiff } from "#src/utils/index.js"

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
          200: {
            type: "object",
            properties: {
              album: { $ref: "entity#" },
              release_date: { type: "string" },
              total_tracks: { type: "number" },
              label: { type: "string" },
              genres: { type: "array", items: { type: "string" } },
              audioFeatures: { $ref: "audioFeatures#" },
              isLiked: { type: "boolean" },
              favouriteTracks: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    ...fastify.getSchema("track").properties,
                    duration_ms: { type: "number" },
                    lastPlayedAt: { type: "string", format: "date-time" },
                    plays: { type: "number" },
                  },
                },
              },
              status: { type: "number" },
            },
          },
        },
        tags: ["infopages"],
      },
    },
    async function (req, reply) {
      const _id = await fastify.getId(req)
      const albumID = req.params.id

      const mainInfo = [fastify.db.Album.findById(albumID).lean()]

      if (_id)
        mainInfo.push(
          fastify.db.User.findById(_id, "tokens.token country").lean()
        )

      let [album, user] = await Promise.all(mainInfo)

      const token = user?.tokens?.token

      if (!album || !album.audioFeatures || !album.release_date) {
        album = await addAlbum(albumID, token)
        album.justAdded = true
      }

      const DAY = 1000 * 60 * 60 * 24
      const notUpdated =
        !album.updated_at || timeDiff(album.updated_at, new Date()) > DAY

      if (!album.justAdded && notUpdated) addAlbum(albumID, token)

      // for unauthenticated users
      if (!token) {
        return reply.send({
          album: {
            id: albumID,
            name: album.name,
            image: album.images.highQuality,
          },
          ...album,
        })
      }

      const requests = [
        fastify.spotifyAPI({
          route: `me/albums/contains?ids=${albumID}`,
          token,
        }),
        fastify.favouriteTracks({
          _id,
          filterID: albumID,
          type: "album",
        }),
      ]

      const [[isLiked], favouriteTracks] = await Promise.all(requests)

      const response = {
        album: {
          id: albumID,
          name: album.name,
          image: album.images.highQuality,
        },
        ...album,
        isLiked,
        favouriteTracks,
      }

      return reply.send(response)
    }
  )
}
