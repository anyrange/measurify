/**
 * @param {import('fastify').FastifyInstance} fastify
 */

import User from "../../../models/User.js";
export default async function(fastify) {
  fastify.get(
    "/",
    {
      schema: {
        response: {
          200: {
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
      attachValidation: true,
    },
    async function(req, reply) {
      try {
        const token = req.cookies.token;
        if (!token) return reply.code(401).send({ message: "Unauthorized" });

        const _id = await fastify.auth(token);

        const user = await User.findOne({ _id }, { _id: 1 });

        if (!user) return reply.code(404).send({ message: "User not found" });

        const agg = [
          {
            $project: {
              userName: 1,
              _id: 0,
              avatar: 1,
              customID: 1,
              private: 1,
              listened: {
                $cond: {
                  if: {
                    $isArray: "$recentlyPlayed",
                  },
                  then: {
                    $size: "$recentlyPlayed",
                  },
                  else: 0,
                },
              },
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

        reply.code(200).send(top);
      } catch (e) {
        reply.code(500).send({ message: "Something went wrong!" });
        console.log(e);
      }
    }
  );
}
