const User = require("../models/User");

const getOverview = (req, res) => {
  const spotifyID = req.query.spotifyID;
  const projection = {
    _id: 0,
    "recentlyPlayed.track.duration_ms": 1,
    "recentlyPlayed.played_at": 1,
  };

  User.findOne({ spotifyID }, projection, (err, user) => {
    if (err) {
      console.log(err);
      return;
    }

    const playDates = user.recentlyPlayed.map(({ played_at, track }) => {
      let date = played_at.split("T")[0];
      let duration = track.duration_ms / 1000 / 60;
      return { date, duration };
    });

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

    res.json( plays );
  });
};

module.exports = getOverview;
