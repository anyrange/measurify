const User = require("../models/User");

const getOverview = (req, res) => {
  const _id = req.get("Authorization");
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

    if (!user || !user.recentlyPlayed || !user.recentlyPlayed.length) {
      res.status(204).json();
      return;
    }

    let recentlyPlayed = user.recentlyPlayed.map(({ played_at, track }) => {
      let date = played_at.split("T")[0];
      let duration = track.duration_ms / 1000 / 60;
      return { date, duration };
    });

    let plays = [];
    let dateToCheck = new Date();
    dateToCheck = dateToCheck.toISOString().split("T")[0];
    while (dateToCheck >= recentlyPlayed[recentlyPlayed.length - 1].date) {
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
      dateToCheck = new Date(dateToCheck);
      dateToCheck.setDate(dateToCheck.getDate() - 1);
      dateToCheck = dateToCheck.toISOString().split("T")[0];
    }

    res.status(200).json(plays);
  });
};

module.exports = getOverview;
