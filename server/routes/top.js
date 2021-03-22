const User = require("../models/User");
const request = require("request");

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
    lastSpotifyToken: 1,
  };

  User.findOne({ spotifyID }, projection, async (err, user) => {
    if (err) {
      console.log(err);
      return;
    }
    let response = {};
    response.albums = albums(user.recentlyPlayed);
    response.tracks = tracks(user.recentlyPlayed);
    response.artists = await artists(user.recentlyPlayed);

    // get images for artists
    const artistsOptions = {
      uri:
        "https://api.spotify.com/v1/artists?ids=" +
        response.artists.map((artist) => artist.id).join(),
      headers: {
        Authorization: "Bearer " + user.lastSpotifyToken,
      },
      json: true,
    };

    request.get(artistsOptions, async (error, resp, body) => {
      await response.artists.forEach((artist, index) => {
        if (body.artists[index].images[2]) {
          artist.image = body.artists[index].images[2].url;
        }
      });
      res.end(JSON.stringify(response));
    });
  });
};

const albums = (recentlyPlayed) => {
  let albums = [];

  while (recentlyPlayed.length) {
    // get array of tracks from one album
    const filteredHistory = recentlyPlayed.filter(
      (item) => item.track.album.name === recentlyPlayed[0].track.album.name
    );

    // calculate duration
    const reducer = (accumulator, currentValue) =>
      accumulator + currentValue.track.duration_ms;

    const playtime = Math.round(filteredHistory.reduce(reducer, 0) / 1000 / 60);

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

  // sort by time and get first 20 elements
  return albums
    .sort(function(a, b) {
      if (a.playtime < b.playtime) {
        return 1;
      }
      if (a.playtime > b.playtime) {
        return -1;
      }
      return 0;
    })
    .slice(0, 20);
};

const tracks = (recentlyPlayed) => {
  let tracks = [];

  while (recentlyPlayed.length) {
    // get array of simillar tracks
    const filteredHistory = recentlyPlayed.filter(
      (item) => item.track.name === recentlyPlayed[0].track.name
    );

    // calculate duration
    const reducer = (accumulator, currentValue) =>
      accumulator + currentValue.track.duration_ms;

    const playtime = Math.round(filteredHistory.reduce(reducer, 0) / 1000 / 60);

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

  // sort by time and get first 20 elements
  return tracks
    .sort(function(a, b) {
      if (a.playtime < b.playtime) {
        return 1;
      }
      if (a.playtime > b.playtime) {
        return -1;
      }
      return 0;
    })
    .slice(0, 20);
};

const artists = (recentlyPlayed) => {
  let artists = [];
  let uniqueArtistsNames = [];
  let uniqueArtists = [];

  recentlyPlayed.forEach(({ track }) =>
    track.artists.forEach((artist) => {
      if (!uniqueArtistsNames.includes(artist.name)) {
        uniqueArtistsNames.push(artist.name);
        uniqueArtists.push({ name: artist.name, id: artist.id });
      }
    })
  );

  while (uniqueArtists.length) {
    let playtime = 0;

    // checks if artist is array of artists
    for (let i = 0; i < 3; i++) {
      const filteredHistory = recentlyPlayed.filter((item) => {
        if (
          item.track.artists.length - 1 >= i &&
          item.track.artists[i].name === uniqueArtists[0].name
        ) {
          return item;
        }
      });

      // calculate duration
      const reducer = (accumulator, currentValue) =>
        accumulator + currentValue.track.duration_ms;
      if (filteredHistory.length) {
        playtime += Math.round(filteredHistory.reduce(reducer, 0) / 1000 / 60);
      }
    }

    artists.push({
      name: uniqueArtists[0].name,
      id: uniqueArtists[0].id,
      playtime,
    });

    uniqueArtists.shift();
  }

  // sort by time and get first 20 elements
  let sortedArtists = artists
    .sort(function(a, b) {
      if (a.playtime < b.playtime) {
        return 1;
      }
      if (a.playtime > b.playtime) {
        return -1;
      }
      return 0;
    })
    .slice(0, 20);

  return sortedArtists;
};

module.exports = top;
