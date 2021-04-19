const User = require("../models/User");
const { ObjectId } = require("mongodb");

const getPlayedHistory = async (req, res) => {
  try {
    const _id = req.get("Authorization");
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
          "recentlyPlayed.track.album.id": 1,
          "recentlyPlayed.track.album.name": 1,
          "recentlyPlayed.track.artists.id": 1,
          "recentlyPlayed.track.artists.name": 1,
          "recentlyPlayed.track.duration_ms": 1,
          "recentlyPlayed.track.id": 1,
          "recentlyPlayed.track.name": 1,
          "recentlyPlayed.played_at": 1,
        },
      },
      {
        $project: {
          tracksLength: {
            $cond: {
              if: { $isArray: "$recentlyPlayed" },
              then: { $size: "$recentlyPlayed" },
              else: "NA",
            },
          },
          recentlyPlayed: {
            $slice: ["$recentlyPlayed", page * 50, 50],
          },
        },
      },
    ];

    const user = await User.aggregate(agg);

    if (user[0].tracksLength === "NA") {
      res.status(204).json();
      return;
    }

    res.status(200).json({
      numberOfPages: Math.ceil(user[0].tracksLength / 50),
      history: user[0].recentlyPlayed,
    });
  } catch (e) {
    res.status(404).json();
    console.log(e);
  }
};

module.exports = getPlayedHistory;
