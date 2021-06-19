import User from "../../../models/User.js";
export default async function(fastify) {
  const headers = fastify.getSchema("cookie");

  fastify.get(
    "",
    {
      schema: {
        headers,
        response: {
          200: {
            type: "object",
            required: ["status", "top"],
            properties: {
              status: {
                type: "number",
              },
              top: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    userName: {
                      type: "string",
                    },
                    privacy: {
                      type: "string",
                    },
                    avatar: {
                      type: "string",
                    },
                    customID: {
                      type: "string",
                    },
                    listened: {
                      type: "number",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    async function(req, reply) {
      const _id = req.user_id;
      const user = await User.findOne({ _id }, { _id: 1 });

      if (!user) throw new this.CustomError("User not found", 404);

      const agg = [
        {
          $match: {
            privacy: { $ne: "private" },
          },
        },
        {
          $project: {
            userName: 1,
            avatar: 1,
            customID: 1,
            privacy: 1,
            "recentlyPlayed.plays.played_at": 1,
          },
        },
        {
          $unwind: {
            path: "$recentlyPlayed",
          },
        },
        {
          $project: {
            userName: 1,
            avatar: 1,
            customID: 1,
            privacy: 1,
            "recentlyPlayed.duration_ms": 1,
            "recentlyPlayed.plays": {
              $size: "$recentlyPlayed.plays",
            },
          },
        },
        {
          $group: {
            _id: {
              userName: "$userName",
              avatar: "$avatar",
              customID: "$customID",
              privacy: "$privacy",
            },
            listened: { $sum: "$recentlyPlayed.plays" },
          },
        },
        {
          $match: {
            listened: {
              $gt: 0,
            },
          },
        },
        {
          $sort: {
            listened: -1,
          },
        },
      ];

      const top = await User.aggregate(agg);

      reply.code(200).send({
        top: top.map((user) => {
          return {
            avatar: user._id.avatar,
            customID: user._id.customID,
            privacy: user._id.privacy,
            userName: user._id.userName,
            listened: user.listened,
          };
        }),
        status: 200,
      });
    }
  );
}
