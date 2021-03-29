const User = require("../models/User");

const getOverview = (req, res) => {
  let _id = req.get("Authorization");
  if (!_id) {
    res.status(400).json({ message: `Unauthorized` });
    return;
  }
  const projection = {
    _id: 0,
    "recentlyPlayed.track.duration_ms": 1,
    "recentlyPlayed.played_at": 1,
  };

  User.findOne({ _id }, projection, (err, user) => {
    if (err || !user) {
      res.status(400).json({errorMessage:err.toString()});
      return;
    }

    const playDates = user.recentlyPlayed.map(({ played_at, track }) => {
      let date = played_at.split("T")[0];
      let duration = track.duration_ms / 1000 / 60;
      return { date, duration };
    });
    if (!playDates.length) {
      res.status(200).json({});
      return;
    }
    dateToCompare = playDates[0].date;
    let plays = [];
    let i = 0;
    let playsCounter = 0;
    let durationCounter = 0;
    while (i < playDates.length) {
      if (dateToCompare === playDates[i].date) {
        playsCounter++;
        durationCounter += playDates[i].duration;
      } else {
        plays.push({
          plays: playsCounter,
          date: dateToCompare,
          duration: Math.round(durationCounter),
        });
        playsCounter = 1;
        durationCounter = playDates[i].duration;
        dateToCompare = playDates[i].date;
      }
      i++;
    }
    plays.push({
      plays: playsCounter,
      date: dateToCompare,
      duration: Math.round(durationCounter),
    });

    res.status(200).json(plays);
  });
};

module.exports = getOverview;
