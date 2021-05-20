import mongodb from "mongodb";
const { ObjectId } = mongodb;
import User from "../models/User.js";

export default async function(id, filterId) {
  try {
    const agg = [
      {
        $match: {
          _id: new ObjectId(id),
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
            { "recentlyPlayed.id": filterId },
          ],
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
    return await User.aggregate(agg);
  } catch (e) {
    console.log(JSON.stringify(e));
  }
}
