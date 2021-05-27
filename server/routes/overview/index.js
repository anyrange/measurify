/**
 * @param {import('fastify').FastifyInstance} fastify
 */

import User from "../../models/User.js";
import mongodb from "mongodb";
const { ObjectId } = mongodb;
import formatOverview from "../../includes/format-overview.js";

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
              required: ["date", "duration", "plays"],
              properties: {
                date: { type: "string" },
                duration: { type: "number" },
                plays: { type: "number" },
              },
            },
          },
        },
      },
      attachValidation: true,
    },
    async (req, reply) => {
      try {
        const token = req.cookies.token;
        if (!token) return reply.code(401).send({ message: "Unauthorized" });

        const _id = await fastify.auth(token);

        const user = await User.findOne({ _id }, { _id: 1 });

        if (!user) return reply.code(404).send({ message: "User not found" });

        const agg = [
          {
            $match: {
              _id: new ObjectId(_id),
            },
          },
          {
            $project: {
              "recentlyPlayed.played_at": 1,
              "recentlyPlayed.duration_ms": 1,
            },
          },
          {
            $unwind: {
              path: "$recentlyPlayed",
            },
          },
          {
            $addFields: {
              "recentlyPlayed.played_at": {
                $toDate: "$recentlyPlayed.played_at",
              },
            },
          },
          {
            $project: {
              "recentlyPlayed.duration_ms": 1,
              "recentlyPlayed.played_at": {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$recentlyPlayed.played_at",
                },
              },
            },
          },
          {
            $group: {
              _id: {
                date: "$recentlyPlayed.played_at",
              },
              plays: {
                $sum: 1,
              },
              playtime: {
                $sum: "$recentlyPlayed.duration_ms",
              },
            },
          },
          {
            $sort: {
              "_id.date": -1,
            },
          },
        ];

        const plays = await User.aggregate(agg);

        if (!plays.length) {
          reply.code(204).send({});
          return;
        }

        reply.code(200).send(await formatOverview(plays));
      } catch (e) {
        reply.code(500).send({ message: "Something went wrong!" });
        console.log(e);
      }
    }
  );
}
