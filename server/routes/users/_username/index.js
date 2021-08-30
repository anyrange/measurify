export default async function (fastify) {
  fastify.get(
    "",
    {
      schema: {
        query: {
          type: "object",
          properties: {
            rangeTop: { type: "number", minimum: 1, maximum: 50, default: 6 },
            rangeGenres: {
              type: "number",
              minimum: 1,
              maximum: 20,
              default: 10,
            },
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
              history: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    ...fastify.getSchema("track").properties,
                    duration_ms: { type: "number" },
                    played_at: { type: "string", format: "date" },
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
      const { user } = req;
      const { rangeTop, rangeHistory, rangeGenres } = req.query;

      const requests = [
        fastify.userTop({ _id: user._id, range: rangeTop }),
        fastify.userListeningHistory({ _id: user._id, range: rangeHistory }),
        fastify.userOverview({ _id: user._id }),
        genresTop(user.tokens.token, rangeGenres),
      ];

      const [top, { history }, overview, genres] = await Promise.all(requests);

      const response = {
        user,
        top,
        history,
        overview,
        genres,
        leaved: user.tokens.refreshToken === "",
      };

      reply.send(response);
    }
  );

  const genresTop = async (token, range) => {
    const artists = await fastify.spotifyAPI({
      route: "me/top/artists?time_range=medium_term&limit=50",
      token,
    });

    if (!artists.items.length) return [];
    const genres = artists.items.map(({ genres }) => genres).flat(1);

    let res = genres.reduce((data, curr) => {
      data[curr] = data[curr] ? ++data[curr] : 1;
      return data;
    }, {});

    const genresTop = [];

    Object.entries(res).forEach(([val, numTimes]) => {
      genresTop.push({ genre: val, times: numTimes });
    });

    return genresTop
      .sort(function (a, b) {
        return b.times - a.times;
      })
      .map(({ genre }) => genre)
      .slice(0, range);
  };
}
