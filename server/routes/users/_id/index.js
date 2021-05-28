import User from "../../../models/User.js";
import fetch from "node-fetch";
import mongodb from "mongodb";

const { ObjectId } = mongodb;

export default async function(fastify) {
  const top = fastify.getSchema("top");
  const history = fastify.getSchema("listening-history");

  const responseSchema = {
    200: {
      type: "object",
      required: [
        "userName",
        "avatar",
        "lastLogin",
        "overview",
        "history",
        "top",
        "genres",
        "status",
      ],
      properties: {
        userName: {
          type: "string",
        },
        avatar: {
          type: "string",
        },
        lastlogin: {
          type: "string",
        },
        history,
        overview: {
          type: "object",
          required: ["plays", "playtime"],
          properties: {
            plays: {
              type: "number",
            },
            playtime: {
              type: "number",
            },
          },
        },
        top,
        genres: {
          type: "array",
          items: {
            type: "string",
          },
        },
        status: {
          type: "number",
        },
      },
    },
  };

  fastify.get(
    "/",
    {
      schema: {
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: {
              type: "string",
            },
          },
        },
        response: responseSchema,
      },
      attachValidation: true,
    },
    async function(req, reply) {
      try {
        if (req.validationError)
          return reply.code(404).send({ message: "Invalid user", status: 404 });

        const token = req.cookies.token;
        if (!token)
          return reply.code(401).send({ message: "Unauthorized", status: 401 });

        const _id = await fastify.auth(token);

        const customID = req.params.id;

        const users = await User.find(
          { $or: [{ customID }, { _id }] },
          {
            userName: 1,
            private: 1,
            avatar: 1,
            lastLogin: 1,
            customID: 1,
            lastSpotifyToken: 1,
          }
        );

        if (!users.find((user) => user._id == _id))
          return reply.code(401).send({ message: "Unauthorized", status: 401 });

        const user = users.find((user) => user.customID == customID);

        if (!user)
          return reply
            .code(404)
            .send({ message: "User not found", status: 404 });

        if (user.private && _id != user._id)
          return reply
            .code(403)
            .send({ message: "Private profile", status: 403 });

        const agg = [
          {
            $match: {
              _id: ObjectId(user._id),
            },
          },
          {
            $project: {
              "recentlyPlayed.duration_ms": 1,
              _id: 0,
            },
          },
          {
            $unwind: {
              path: "$recentlyPlayed",
            },
          },
          {
            $group: {
              _id: {},
              plays: {
                $sum: 1,
              },
              playtime: {
                $sum: "$recentlyPlayed.duration_ms",
              },
            },
          },
        ];

        const requests = [
          fastify.parseTop(user._id, user.lastSpotifyToken, 5),
          fastify.parseHistory(user._id, 20),
          User.aggregate(agg).then((body) => {
            if (!body[0]) return { plays: 0, playtime: 0 };
            return {
              plays: body[0].plays,
              playtime: Math.round(body[0].playtime / 1000 / 60),
            };
          }),
          genresTop(user.lastSpotifyToken),
        ];

        const [top, history, overview, genres] = await Promise.all(requests);

        const response = {
          userName: user.userName,
          avatar: user.avatar,
          lastLogin: user.lastLogin,
          top,
          history: history[0].recentlyPlayed || [],
          overview,
          genres,
          status: 200,
        };

        reply.code(200).send(response);
      } catch (e) {
        reply.code(500).send({ message: "Something went wrong!", status: 500 });
        console.log(e);
      }
    }
  );
}

const genresTop = async (lastSpotifyToken) => {
  const { artists } = await fetch(
    "https://api.spotify.com/v1/me/following?type=artist&limit=50",
    {
      headers: {
        Authorization: "Bearer " + lastSpotifyToken,
      },
    }
  )
    .then((res) => res.json())
    .catch((e) => {
      throw e;
    });
  if (!artists.items.length) return [];
  const genres = artists.items
    .map(({ genres }) => {
      return genres;
    })
    .flat(1);

  let res = genres.reduce((data, curr) => {
    data[curr] = data[curr] ? ++data[curr] : 1;
    return data;
  }, {});

  const genresTop = [];

  Object.entries(res).forEach(([val, numTimes]) => {
    genresTop.push({ genre: val, times: numTimes });
  });

  return genresTop
    .sort(function(a, b) {
      return b.times - a.times;
    })
    .map(({ genre }) => genre)
    .slice(0, 10);
};
