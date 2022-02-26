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
              overview: { $ref: "overview#" },
              top: { $ref: "top#" },
              genres: { type: "array", items: { type: "string" } },
              leaved: { type: "boolean" },
              followed: { type: "boolean" },
              follows: { type: "number" },
              followers: { type: "number" },
              history: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    ...fastify.getSchema("track").properties,
                    duration_ms: { type: "number" },
                    played_at: { type: "string", format: "datetime" },
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
      const requestorID = req.session.get("id");
      const { username } = req.params;

      const user = await fastify.db.User.findOne(
        { "settings.username": username },
        {
          "tokens.refreshToken": 1,
          listened: 1,
          genres: { $first: "$genresTimeline.genres" },
          avatar: 1,
          display_name: 1,
          username: "$settings.username",
          lastLogin: 1,
          registrationDate: 1,
          country: 1,
          spotifyID: "$_id",
          followed: { $elemMatch: { $eq: requestorID } },
          followers: { $size: "$followers" },
          follows: { $size: "$follows" },
        }
      ).lean();

      if (!user) return reply.code(404).send({ message: "User not found" });

      const { rangeTop, rangeHistory } = req.query;

      const requests = [
        fastify.userTop({ _id: user._id, range: rangeTop }),
        fastify.userListeningHistory({ _id: user._id, range: rangeHistory }),
      ];

      const [top, { history }] = await Promise.all(requests);

      const response = {
        user,
        top,
        history,
        overview: {
          plays: user.listened.count,
          playtime: Math.round(user.listened.time / 60),
        },
        genres: user.genres,
        followers: user.followers,
        follows: user.follows,
        leaved: user.tokens.refreshToken === "",
        followed: !!user.followed?.length,
      };

      reply.send(response);
    }
  );
}
