/**
 * @param {import('fastify').FastifyInstance} fastify
 */

import User from "../../../models/User.js";
export default async function(fastify) {
  const headers = fastify.getSchema("cookie");

  fastify.get(
    "/",
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
                    private: {
                      type: "boolean",
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
      attachValidation: true,
    },
    async function(req, reply) {
      try {
        if (req.validationError) {
          const { status, message } = fastify.validate(req.validationError);
          return reply.code(status).send({ message, status });
        }

        const _id = await fastify.auth(req.cookies.token);
        const user = await User.findOne({ _id }, { _id: 1 });

        if (!user)
          return reply
            .code(404)
            .send({ message: "User not found", status: 404 });

        const agg = [
          {
            $project: {
              userName: 1,
              avatar: 1,
              customID: 1,
              private: 1,
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
              private: 1,
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
                private: "$private",
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
              private: user._id.private,
              userName: user._id.userName,
              listened: user.listened,
            };
          }),
          status: 200,
        });
      } catch (e) {
        reply.code(500).send({ message: "Something went wrong!", status: 500 });
        console.log(e);
      }
    }
  );
}
