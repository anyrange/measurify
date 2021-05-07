const User = require("../models/User");
const { ObjectId } = require("mongodb");
const formatOverview = require("../includes/overview");

const getOverview = async (req, res) => {
  try {
    const _id = req.get("Authorization");
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
      res.status(204).json();
      return;
    }
    res.status(200).json(await formatOverview(plays));
  } catch (e) {
    res.status(404).json({ message: "Something went wrong!" });
    console.log(e);
  }
};

module.exports = getOverview;
