const User = require("../models/User");

const albums = (recentlyPlayed) => {
  let albums = [];

  while (recentlyPlayed.length) {
    // get array of tracks from one album
    let filteredHistory = recentlyPlayed.filter(
      (item) => item.track.album.name === recentlyPlayed[0].track.album.name
    );

    // calculate duration
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

const tracks = (recentlyPlayed) => {
  let tracks = [];

  while (recentlyPlayed.length) {
    // get array of simillar tracks
    let filteredHistory = recentlyPlayed.filter(
      (item) => item.track.name === recentlyPlayed[0].track.name
    );

    // calculate duration
    let reducer = (accumulator, currentValue) =>
      accumulator + currentValue.track.duration_ms;

    playtime = Math.round(filteredHistory.reduce(reducer, 0) / 1000 / 60);

    tracks.push({
      name: recentlyPlayed[0].track.name,
      image: recentlyPlayed[0].track.album.images[2].url,
      id: recentlyPlayed[0].track.id,
      playtime,
    });

    recentlyPlayed = recentlyPlayed.filter(
      (item) => item.track.name !== recentlyPlayed[0].track.name
    );
  }

  // sort by time
  return tracks.sort(function(a, b) {
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
    response.tracks = tracks(user.recentlyPlayed);

    res.end(JSON.stringify(response));
  });
};

module.exports = top;
