import { arrLastEl } from "#server/utils/index.js";

export default async function (fastify) {
  fastify.addHook("onSend", async (request, reply) => {
    if (reply.statusCode === 200)
      reply.header("Cache-Control", "public, max-age=5");
  });
  fastify.post(
    "",
    {
      schema: {
        query: {
          type: "object",
          properties: {
            limit: { type: "number", minimum: 3, default: 10 },
          },
        },
        body: {
          type: "object",
          properties: {
            meta: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  username: { type: "string" },
                  point: { type: "number" },
                },
              },
            },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              meta: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    username: { type: "string" },
                    point: { type: "number" },
                  },
                },
              },
              userActivity: {
                type: "object",
                additionalProperties: false,
                patternProperties: {
                  "^[0-9]{4}-[0-9]{2}-[0-9]{2}$": {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        username: { type: "string" },
                        display_name: { type: "string" },
                        avatar: { type: "string" },
                        tracks: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              id: { type: "string" },
                              name: { type: "string" },
                              artists: { $ref: "entities#" },
                              image: { type: "string" },
                              played_at: { type: "string", format: "datetime" },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        tags: ["other"],
      },
      preValidation: [fastify.auth],
    },
    async function (req, reply) {
      const { limit } = req.query;
      const { meta } = req.body;
      const id = req.session.get("id");

      const userActivity = await fastify.db.User.aggregate(
        getActivityAgg(id, limit, meta)
      );

      // pack activity by date and users
      const formatedActivity = {};
      userActivity.forEach((activity) => {
        const date = activity.track.played_at.toISOString().split("T")[0];

        const lastAdded = arrLastEl(formatedActivity[date]);
        const sameUser = lastAdded && lastAdded.username === activity.username;

        if (sameUser) {
          lastAdded.tracks.push(activity.track);
          return;
        }

        formatedActivity[date] = [
          ...(formatedActivity[date] || []),
          { ...activity, tracks: [activity.track] },
        ];
      });

      const newMeta = new Map();
      meta.forEach(({ username, point }) => newMeta.set(username, point));
      userActivity.forEach(({ username }) =>
        newMeta.set(username, (newMeta.get(username) || 0) + 1)
      );

      reply.send({
        meta: Array.from(newMeta, ([key, value]) => ({
          username: key,
          point: value,
        })),
        userActivity: formatedActivity,
      });
    }
  );
}

const getActivityAgg = (_id, limit, meta = []) => {
  let condChain = { $slice: ["$user.listeningHistory", 0, limit] };

  if (meta.length) {
    meta.forEach(({ username, point }) => {
      condChain = {
        $cond: {
          if: { $eq: ["$user.settings.username", username] },
          then: { $slice: ["$user.listeningHistory", point, limit] },
          else: condChain,
        },
      };
    });
  }

  return [
    { $match: { _id } },
    { $project: { follows: 1 } },
    {
      $lookup: {
        from: "users",
        localField: "follows",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: { path: "$user" } },
    { $match: { "user.settings.privacy": "public" } },
    {
      $project: {
        display_name: "$user.display_name",
        avatar: "$user.avatar",
        username: "$user.settings.username",
        listeningHistory: condChain,
      },
    },
    { $unwind: { path: "$listeningHistory" } },
    { $sort: { "listeningHistory.played_at": -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "tracks",
        localField: "listeningHistory.track",
        foreignField: "_id",
        as: "tracks",
      },
    },
    {
      $lookup: {
        from: "artists",
        localField: "tracks.artists",
        foreignField: "_id",
        as: "artists",
      },
    },
    { $addFields: { artists: { id: "$artists._id" } } },
    {
      $project: {
        _id: 1,
        display_name: 1,
        username: 1,
        avatar: 1,
        track: {
          played_at: "$listeningHistory.played_at",
          name: { $first: "$tracks.name" },
          id: { $first: "$tracks._id" },
          artists: {
            $map: {
              input: "$artists",
              as: "artist",
              in: { id: "$$artist._id", name: "$$artist.name" },
            },
          },
          image: { $first: "$tracks.images.lowQuality" },
        },
      },
    },
  ];
};
