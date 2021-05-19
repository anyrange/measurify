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
        $project: {
          _id: 0,
          "recentlyPlayed.id": 1,
          "recentlyPlayed.artists.id": 1,
          "recentlyPlayed.album.id": 1,
          "recentlyPlayed.duration_ms": 1,
          "recentlyPlayed.played_at": 1,
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
