import fp from "fastify-plugin";
import User from "../../models/User.js";
import mongodb from "mongodb";

const { ObjectId } = mongodb;

const plugin = fp(async function plugin(fastify) {
  fastify.decorate(
    "parseHistory",
    async (_id, range = 50, page = 0, search) => {
      const agg = [
        {
          $match: {
            _id: new ObjectId(_id),
          },
        },
        {
          $project: {
            "recentlyPlayed.album.id": 1,
            "recentlyPlayed.album.name": 1,
            "recentlyPlayed.artists.id": 1,
            "recentlyPlayed.artists.name": 1,
            "recentlyPlayed.duration_ms": 1,
            "recentlyPlayed.id": 1,
            "recentlyPlayed.name": 1,
            "recentlyPlayed.plays.played_at": 1,
          },
        },
        {
          $unwind: {
            path: "$recentlyPlayed",
          },
        },
        {
          $unwind: {
            path: "$recentlyPlayed.plays",
          },
        },
      ];

      if (search) {
        const query = new RegExp(
          `.*${search.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&")}.*`,
          "i"
        );
        agg.push({
          $match: {
            $or: [
              { "recentlyPlayed.album.name": { $regex: query } },
              { "recentlyPlayed.artists.name": { $regex: query } },
              { "recentlyPlayed.name": { $regex: query } },
            ],
          },
        });
      }

      agg.push(
        {
          $project: {
            "recentlyPlayed.album.id": 1,
            "recentlyPlayed.album.name": 1,
            "recentlyPlayed.artists.id": 1,
            "recentlyPlayed.artists.name": 1,
            "recentlyPlayed.duration_ms": 1,
            "recentlyPlayed.id": 1,
            "recentlyPlayed.name": 1,
            "recentlyPlayed.played_at": "$recentlyPlayed.plays.played_at",
          },
        },
        {
          $sort: {
            "recentlyPlayed.played_at": -1,
          },
        },
        {
          $group: {
            _id: null,
            tracksQuantity: { $sum: 1 },
            recentlyPlayed: { $push: "$recentlyPlayed" },
          },
        },
        {
          $project: {
            tracksQuantity: 1,
            recentlyPlayed: {
              $slice: ["$recentlyPlayed", page * range, range],
            },
          },
        }
      );
      return await User.aggregate(agg);
    }
  );
});

export default plugin;
