const User = require("../models/User");

const getPlayedHistory = (req, res) => {
  const spotifyID = req.query.spotifyID;
  const projection = {
    _id: 0,

    "recentlyPlayed.track.album.id": 1,
    "recentlyPlayed.track.album.name": 1,
    "recentlyPlayed.track.artists.id": 1,
    "recentlyPlayed.track.artists.name": 1,
    "recentlyPlayed.track.duration_ms": 1,
    "recentlyPlayed.track.id": 1,
    "recentlyPlayed.track.name": 1,
    "recentlyPlayed.played_at": 1,
  };

  User.findOne({ spotifyID }, projection, (err, user) => {
    if (err) {
      console.log(err);
      return;
    }

    res.json(user.toJSON().recentlyPlayed);
  });
};

module.exports = getPlayedHistory;