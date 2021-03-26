const request = require("request");
const User = require("../models/User");

const infoPages = {
  artist: (req, res) => {
    const spotifyID = req.query.spotifyID;
    const artistID = req.query.artistID;

    User.findOne(
      { spotifyID },
      {
        _id: 0,
        "recentlyPlayed.track.artists.id": 1,
        "recentlyPlayed.track.artists.name": 1,
        "recentlyPlayed.track.album.images.url": 1,
        "recentlyPlayed.track.album.id": 1,
        "recentlyPlayed.track.album.name": 1,
        "recentlyPlayed.track.duration_ms": 1,
        "recentlyPlayed.track.id": 1,
        "recentlyPlayed.track.name": 1,
        "recentlyPlayed.played_at": 1,
        lastSpotifyToken: 1,
      },
      (err, user) => {
        if (err) {
          res.status(400).end(err);
          return;
        }
        user.recentlyPlayed = user.recentlyPlayed.filter((item) => {
          for (let i = 0; i < item.track.artists.length; i++) {
            if (item.track.artists[i].id === artistID) {
              return item;
            }
          }
        });

        const artistsOptions = {
          uri: `https://api.spotify.com/v1/artists/${artistID}`,
          headers: {
            Authorization: "Bearer " + user.lastSpotifyToken,
          },
          json: true,
        };

        request.get(artistsOptions, (error, resp, body) => {
          res.json({
            artist: {
              followers: body.followers.total,
              genres: body.genres,
              name: body.name,
              image: body.images[0].url,
              link: body.external_urls.spotify
            },
            overview: plays(user),
            tracks: tracks(user.recentlyPlayed),
          });
        });
      }
    );
  },
};

const plays = (user) => {
  const playDates = user.recentlyPlayed.map(({ played_at, track }) => {
    let date = played_at.split("T")[0];
    let duration = track.duration_ms / 1000 / 60;
    return { date, duration };
  });
  if (!playDates.length) {
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
  return plays;
};

const tracks = (recentlyPlayed) => {
  let tracks = [];

  while (recentlyPlayed.length) {
    // get array of simillar tracks
    const filteredHistory = recentlyPlayed.filter(
      (item) => item.track.name === recentlyPlayed[0].track.name
    );

    tracks.push({
      album: {
        name: recentlyPlayed[0].track.album.name,
        id: recentlyPlayed[0].track.album.id,
        image: recentlyPlayed[0].track.album.images[2].url,
      },
      artists: recentlyPlayed[0].track.artists,
      name: recentlyPlayed[0].track.name,
      id: recentlyPlayed[0].track.id,
      duration_ms: recentlyPlayed[0].track.duration_ms,
      plays: filteredHistory.length,
      played_at: recentlyPlayed[0].played_at,
    });

    recentlyPlayed = recentlyPlayed.filter(
      (item) => item.track.name !== recentlyPlayed[0].track.name
    );
  }

  // sort by number of plays and get first 20 elements
  return tracks
    .sort(function(a, b) {
      if (a.plays < b.plays) {
        return 1;
      }
      if (a.plays > b.plays) {
        return -1;
      }
      return 0;
    })
    .slice(0, 20);
};

module.exports = infoPages;
