const User = require("../models/User");
const { ObjectId } = require("mongodb");

const getOverview = async (req, res) => {
  try {
    const _id = req.get("Authorization");
    res.status(200).json(await plays(_id));
  } catch (e) {
    res.status(404).json();
    console.log(e);
  }
};

const plays = async (id) => {
  try {
    const agg = [
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      {
        $project: {
          "recentlyPlayed.played_at": 1,
          "recentlyPlayed.track.duration_ms": 1,
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
          "recentlyPlayed.track.duration_ms": 1,
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
            $sum: "$recentlyPlayed.track.duration_ms",
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
    if (!plays.length) return [];
    let overview = [];
    const firstDate = plays[plays.length - 1]._id.date;
    const date = new Date();
    let day = date.toISOString().split("T")[0];

    while (day >= firstDate) {
      const play = plays.find((play) => play._id.date === day);

      if (play) {
        overview.push({
          date: play._id.date,
          plays: play.plays,
          duration: Math.round(play.playtime / 1000 / 60),
        });
      } else {
        overview.push({ date: day, plays: 0, duration: 0 });
      }

      day = new Date(day);
      day.setDate(day.getDate() - 1);
      day = day.toISOString().split("T")[0];
    }

    return overview;
  } catch (e) {
    console.log(e);
  }
};
module.exports = getOverview;
