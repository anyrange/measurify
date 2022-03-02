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
                              image: { type: "string" },
                              played_at: { type: "string", format: "datetime" },
                            },
                          },
                        },
                      },
                    },
                  },
                },
                additionalProperties: false,
              },
            },
          },
        },
        tags: ["other"],
      },
    },
    async function (req, reply) {
      const { limit, page } = req.query;

      const [userActivity, userListened] = await Promise.all([
        fastify.db.User.aggregate(getActivityAgg(limit, page)),
        fastify.db.User.find(
          {
            "settings.privacy": { $ne: "private" },
            "tokens.refreshToken": { $ne: "" },
          },
          "listened.count"
        ),
      ]);

      const historyLength = userListened.reduce(
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

const getActivityAgg = (limit, page) => [
  {
    $match: {
      "settings.privacy": { $ne: "private" },
      "tokens.refreshToken": { $ne: "" },
    },
  },
  {
    $project: {
      listeningHistory: 1,
      display_name: 1,
      username: "$settings.username",
      avatar: 1,
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
    $project: {
      _id: 1,
      display_name: 1,
      username: 1,
      avatar: 1,
      track: {
        played_at: "$listeningHistory.played_at",
        name: { $first: "$tracks.name" },
        id: { $first: "$tracks._id" },
        image: { $first: "$tracks.images.lowQuality" },
      },
    },
  },
];
