import User from "../../models/User.js";
import mongodb from "mongodb";
const { ObjectId } = mongodb;
import formatOverview from "../../utils/format-overview.js";

export default async function(fastify) {
  fastify.get(
    "",
    {
      schema: {
        response: {
          200: {
            type: "object",
            required: ["overview", "status"],
            properties: {
              status: { type: "number" },
              overview: {
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
        },
      },
    },
    async function(req, reply) {
      const _id = await fastify.auth(req);

      const agg = [
        { $match: { _id: new ObjectId(_id) } },
        {
          $project: {
            "recentlyPlayed.plays.played_at": 1,
            "recentlyPlayed.duration_ms": 1,
          },
        },
        { $unwind: { path: "$recentlyPlayed" } },
        { $unwind: { path: "$recentlyPlayed.plays" } },
        {
          $addFields: {
            "recentlyPlayed.played_at": {
              $toDate: "$recentlyPlayed.plays.played_at",
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
            _id: { date: "$recentlyPlayed.played_at" },
            plays: { $sum: 1 },
            playtime: { $sum: "$recentlyPlayed.duration_ms" },
          },
        },
        {
          $project: {
            date: "$_id.date",
            plays: 1,
            duration: { $round: { $divide: ["$playtime", 60000] } },
            _id: 0,
          },
        },
        { $sort: { date: -1 } },
      ];

      const plays = await User.aggregate(agg);

      if (!plays || !plays.length)
        return reply.send({ status: 204, overview: [] });

      reply.send({ overview: formatOverview(plays), status: 200 });
    }
  );
}
