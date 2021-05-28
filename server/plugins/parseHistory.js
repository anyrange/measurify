import fp from "fastify-plugin";
import User from "../models/User.js";
import mongodb from "mongodb";

const { ObjectId } = mongodb;

const plugin = fp(async function plugin(fastify) {
  fastify.decorate("parseHistory", async (_id, range = 50, page = 0) => {
    const agg = [
      {
        $match: {
          _id: new ObjectId(_id),
        },
      },
      {
        $project: {
          _id: 0,
          "recentlyPlayed.album.id": 1,
          "recentlyPlayed.album.name": 1,
          "recentlyPlayed.artists.id": 1,
          "recentlyPlayed.artists.name": 1,
          "recentlyPlayed.duration_ms": 1,
          "recentlyPlayed.id": 1,
          "recentlyPlayed.name": 1,
          "recentlyPlayed.played_at": 1,
        },
      },
      {
        $project: {
          tracksLength: {
            $cond: {
              if: { $isArray: "$recentlyPlayed" },
              then: { $size: "$recentlyPlayed" },
              else: 0,
            },
          },
          recentlyPlayed: {
            $slice: ["$recentlyPlayed", page * range, range],
          },
        },
      },
    ];

    return await User.aggregate(agg);
  });
});

export default plugin;
