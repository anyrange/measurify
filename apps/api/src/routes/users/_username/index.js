import dayjs from "dayjs"

export default async function (fastify) {
  fastify.get(
    "",
    {
      schema: {
        query: {
          type: "object",
          properties: {
            rangeTop: { type: "number", minimum: 1, maximum: 50, default: 10 },
            rangeHistory: {
              type: "number",
              minimum: 5,
              maximum: 100,
              default: 50,
            },
          },
        },
        params: {
          type: "object",
          required: ["username"],
          properties: { username: { type: "string" } },
        },
        response: {
          200: {
            type: "object",
            properties: {
              user: { $ref: "user#" },
              overview: {
                type: "object",
                required: ["plays", "playtime", "meantime"],
                properties: {
                  plays: { type: "number" },
                  playtime: { type: "number" },
                  meantime: { type: "number" },
                },
              },
              top: { $ref: "top#" },
              genres: { type: "array", items: { type: "string" } },
              inactive: { type: "boolean" },
              followed: { type: "boolean" },
              follows: { type: "number" },
              followers: { type: "number" },
              reportsAvailability: {
                type: "object",
                properties: {
                  week: { type: "boolean" },
                  month: { type: "boolean" },
                  year: { type: "boolean" },
                },
              },
              history: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    ...fastify.getSchema("track").properties,
                    duration_ms: { type: "number" },
                    played_at: { type: "string", format: "date-time" },
                  },
                },
              },
              status: { type: "number" },
            },
          },
        },
        tags: ["user"],
      },
    },
    async function (req, reply) {
      const requestorID = await fastify.getId(req)
      const { username } = req.params

      const user = await fastify.db.User.findOne(
        { "settings.username": username },
        {
          "tokens.refreshToken": 1,
          "settings.privacy": 1,
          listened: 1,
          genres: { $first: "$genresTimeline.genres" },
          firstListenedTrack: { $last: "$listeningHistory.played_at" },
          avatar: 1,
          display_name: 1,
          username: "$settings.username",
          lastLogin: 1,
          registrationDate: 1,
          country: 1,
          spotifyID: "$_id",
          followers: "$followers",
          follows: "$follows",
        }
      ).lean()

      if (!user) return reply.code(404).send({ message: "User not found" })

      const isPrivate = user.settings.privacy === "private"
      if (isPrivate && user._id !== requestorID)
        return reply.code(403).send({ message: "Private profile" })

      const { rangeTop, rangeHistory } = req.query

      const requests = [
        userTop({ _id: user._id, range: rangeTop }),
        fastify.userListeningHistory({ _id: user._id, range: rangeHistory }),
      ]

      const [top, { history }] = await Promise.all(requests)

      const plays = user.listened?.count || 0
      const playtime = (user.listened?.time || 0) / 60
      const today = dayjs()

      const response = {
        user,
        top,
        history,
        overview: {
          plays,
          playtime: Math.round(playtime),
          meantime: (playtime / plays || 1).toFixed(2),
        },
        reportsAvailability: {
          week: today.diff(user.firstListenedTrack, "week") >= 1,
          month: today.diff(user.firstListenedTrack, "month") >= 1,
          year: today.diff(user.firstListenedTrack, "year") >= 1,
        },
        genres: user.genres || [],
        followers: user.followers?.length || 0,
        follows: user.follows?.length || 0,
        inactive: user.tokens.refreshToken === "",
        followed: user.followers?.includes(requestorID) || false,
      }

      return reply.send(response)
    }
  )

  const userTop = async (options) => {
    const [t, al, art] = await Promise.all([
      fastify.userTopTracks(options),
      fastify.userTopAlbums(options),
      fastify.userTopArtists(options),
    ])

    return {
      tracks: t.tracks,
      albums: al.albums,
      artists: art.artists,
    }
  }
}
