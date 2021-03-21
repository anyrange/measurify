const User = require("../models/User");

const getOverview = (req, res) => {
  const spotifyID = req.query.spotifyID;
  const projection = {
    _id: 0,

    "recentlyPlayed.played_at": 1,
  };

  User.findOne({ spotifyID }, projection, (err, user) => {
    if (err) {
      console.log(err);
      return;
    }

    const playDates = user.recentlyPlayed.map(({ played_at }) => {
      return played_at.split("T")[0];
    });

    dateToCompare = playDates[0];
    let plays = [];
    let i = 0;
    let playsCounter = 0;
    while (i < playDates.length) {
      if (dateToCompare === playDates[i]) {
        playsCounter++;
      } else {
        plays.push({ plays: playsCounter, date: dateToCompare });
        playsCounter = 1;
        dateToCompare = playDates[i];
      }
      i++;
    }
    plays.push({ plays: playsCounter, date: dateToCompare });

    res.end(JSON.stringify({plays}));
  });
};

module.exports = getOverview;
