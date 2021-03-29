const User = require("../models/User");

const getPlayedHistory = (req, res) => {
  let _id = req.get("Authorization");
  if (!_id) {
    res.status(400).json({ message: `Unauthorized`, });
    return
  }
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

  User.findOne({ _id }, projection, (err, user) => {
    if (err || !user) {
      res.status(400).json({errorMessage:err.toString()});
      return;
    }

    res.status(200).json(user.toJSON().recentlyPlayed);
  });
};

module.exports = getPlayedHistory;