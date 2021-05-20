import mongodb from "mongodb";
const { ObjectId } = mongodb;
import User from "../models/User.js";

export default async function(_id, filterId) {
  try {
    const agg = [
      {
        $match: {
          _id: ObjectId(_id),
        },
      },
      {
        $unwind: {
          path: "$recentlyPlayed",
        },
      },
      {
        $match: {
          $or: [
            { "recentlyPlayed.artists.id": filterId },
            { "recentlyPlayed.album.id": filterId },
            { "recentlyPlayed.context.id": filterId },
          ],
        },
      },
      {
        $project: {
          "recentlyPlayed.duration_ms": {
            $divide: ["$recentlyPlayed.duration_ms", 60000],
          },
          "recentlyPlayed.artists.id": 1,
          "recentlyPlayed.album.id": 1,
          "recentlyPlayed.album.name": 1,
          "recentlyPlayed.artists.name": 1,
          "recentlyPlayed.played_at": 1,
          "recentlyPlayed.id": 1,
          "recentlyPlayed.name": 1,
        },
      },
      {
        $group: {
          _id: {
            id: "$recentlyPlayed.id",
            name: "$recentlyPlayed.name",
            album: "$recentlyPlayed.album",
            artists: "$recentlyPlayed.artists",
          },
          playtime: {
            $sum: "$recentlyPlayed.duration_ms",
          },
        },
      },
      {
        $project: {
          playtime: {
            $round: "$playtime",
          },
        },
      },
      {
        $sort: {
          playtime: -1,
        },
      },
      {
        $limit: 20,
      },
    ];
    return await User.aggregate(agg);
  } catch (e) {
    console.log(JSON.stringify(e));
  }
}
