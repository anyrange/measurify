const User = require("../models/User");

const getOverview = (req, res) => {
  let _id = req.get("Authorization");
  if (!_id) {
    res.status(401).json({ message: `Unauthorized` });
    return;
  }
  const projection = {
    _id: 0,
    "recentlyPlayed.track.duration_ms": 1,
    "recentlyPlayed.played_at": 1,
  };

  User.findOne({ _id }, projection, (err, user) => {
    if (err) {
      res.status(408).json({ message: err.toString() });
      return;
    }

    if (!user.recentlyPlayed) {
      res.status(204).json({});
      return;
    }

    let recentlyPlayed = user.recentlyPlayed.map(({ played_at, track }) => {
      let date = played_at.split("T")[0];
      let duration = track.duration_ms / 1000 / 60;
      return { date, duration };
    });

    let plays = [];

    while (recentlyPlayed.length) {
      const dateToCheck = recentlyPlayed[0].date;

      currentDateTracks = recentlyPlayed.filter(
        (track) => track.date === dateToCheck
      );

      const duration = currentDateTracks.reduce((accumulator, currentTrack) => {
        return accumulator + currentTrack.duration;
      }, 0);

      plays.push({
        plays: currentDateTracks.length,
        date: dateToCheck,
        duration: Math.round(duration),
      });
      recentlyPlayed = recentlyPlayed.slice(currentDateTracks.length);
    }

    res.status(200).json(plays);
  });
};

module.exports = getOverview;
