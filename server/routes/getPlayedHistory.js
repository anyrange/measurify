const User = require("../models/User");
const { ObjectId } = require("mongodb");

const getPlayedHistory = async (req, res) => {
  try {
    const _id = req.get("Authorization");
    const range = Number.parseInt(req.query.range) || 50;
    const page = req.query.page - 1 || 0;
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
            $size: "$recentlyPlayed",
          },
          recentlyPlayed: {
            $slice: ["$recentlyPlayed", page * range, range],
          },
        },
      },
    ];

    const user = await User.aggregate(agg);

    if (!user[0].tracksLength) {
      res.status(204).json();
      return;
    }

    res.status(200).json({
      numberOfPages: Math.ceil(user[0].tracksLength / range),
      history: user[0].recentlyPlayed,
    });
  } catch (e) {
    res.status(404).json();
    console.log(e);
  }
};

module.exports = getPlayedHistory;
