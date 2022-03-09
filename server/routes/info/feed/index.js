import { arrLastEl } from "#server/utils/index.js";

export default async function (fastify) {
  fastify.addHook("onSend", async (request, reply) => {
    if (reply.statusCode === 200)
      reply.header("Cache-Control", "public, max-age=5");
  });
  fastify.get(
    "",
    {
      schema: {
        query: {
          type: "object",
          properties: {
            limit: { type: "number", minimum: 3, default: 10 },
            page: { type: "number", minimum: 1, default: 1 },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              pages: { type: "number" },
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
      const { limit, page } = req.query;
      const id = req.session.get("id");

      const [userActivity, user] = await Promise.all([
        fastify.db.User.aggregate(getActivityAgg(id, limit, page)),
        fastify.db.User.findById(id, "follows").populate({
          path: "follows",
          match: { "settings.privacy": "public" },
          select: "listened.count",
        }),
      ]);

      const historyLength = user.follows.reduce(
        (acc, cur) => acc + cur.listened.count,
        0
      );

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

      reply.send({
        pages: Math.ceil(historyLength / limit),
        userActivity: formatedActivity,
      });
    }
  );
}

const getActivityAgg = (_id, limit, page) => [
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
    $addFields: {
      display_name: "$user.display_name",
      avatar: "$user.avatar",
      username: "$user.settings.username",
      listeningHistory: "$user.listeningHistory",
    },
  },
  { $unwind: { path: "$listeningHistory" } },
  { $sort: { "listeningHistory.played_at": -1 } },
  { $skip: (page - 1) * limit },
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
            in: {
              id: "$$artist._id",
              name: "$$artist.name",
            },
          },
        },
        image: { $first: "$tracks.images.lowQuality" },
      },
    },
  },
];
