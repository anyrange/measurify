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
        $project: {
          recentlyPlayed: 1,
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
            { "recentlyPlayed.plays.context.id": filterId },
          ],
        },
      },
      {
        $project: {
          playtime: {
            $round: {
              $divide: [
                {
                  $multiply: [
                    "$recentlyPlayed.duration_ms",
                    { $size: "$recentlyPlayed.plays" },
                  ],
                },
                60000,
              ],
            },
          },
          artists: "$recentlyPlayed.artists",
          album: "$recentlyPlayed.album",
          lastPlayedAt: { $first: "$recentlyPlayed.plays.played_at" },
          id: "$recentlyPlayed.id",
          name: "$recentlyPlayed.name",
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
