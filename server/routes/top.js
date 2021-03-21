const User = require("../models/User");

const albums = (recentlyPlayed) => {
  let albums = [];

  while (recentlyPlayed.length) {
    let filteredHistory = recentlyPlayed.filter(
      (item) => item.track.album.name === recentlyPlayed[0].track.album.name
    );

    let reducer = (accumulator, currentValue) =>
      accumulator + currentValue.track.duration_ms;

    playtime = Math.round(filteredHistory.reduce(reducer, 0) / 1000 / 60);

    albums.push({
      name: recentlyPlayed[0].track.album.name,
      image: recentlyPlayed[0].track.album.images[2].url,
      id: recentlyPlayed[0].track.album.id,
      playtime,
    });

    recentlyPlayed = recentlyPlayed.filter(
      (item) => item.track.album.name !== recentlyPlayed[0].track.album.name
    );
  }

  // sort by time
  return albums.sort(function(a, b) {
    if (a.playtime < b.playtime) {
      return 1;
    }
    if (a.playtime > b.playtime) {
      return -1;
    }
    return 0;
  });
};

const top = (req, res) => {
  const spotifyID = req.query.spotifyID;
  const projection = {
    _id: 0,

    "recentlyPlayed.track.album.id": 1,
    "recentlyPlayed.track.album.name": 1,
    "recentlyPlayed.track.album.images.url": 1,
    "recentlyPlayed.track.artists.id": 1,
    "recentlyPlayed.track.artists.name": 1,
    "recentlyPlayed.track.duration_ms": 1,
    "recentlyPlayed.track.id": 1,
    "recentlyPlayed.track.name": 1,
  };

  User.findOne({ spotifyID }, projection, (err, user) => {
    if (err) {
      console.log(err);
      return;
    }
    let response = {};
    response.albums = albums(user.recentlyPlayed);

    res.end(JSON.stringify(response));
  });
};

module.exports = top;
