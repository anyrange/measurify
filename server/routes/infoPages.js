const User = require("../models/User");
const fetch = require("node-fetch");

const infoPages = {
  artist: (req, res) => {
    const _id = req.get("Authorization");
    if (!_id) {
      res.status(401).json({ message: `Unauthorized` });
      return;
    }
    const artistID = req.params.id;
    User.findOne(
      { _id },
      {
        _id: 0,
        "recentlyPlayed.track.artists.id": 1,
        "recentlyPlayed.track.artists.name": 1,
        "recentlyPlayed.track.artists.external_urls.spotify": 1,
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
          res.status(408).json({ message: err.toString() });
          return;
        }

        user.recentlyPlayed = user.recentlyPlayed.filter((item) => {
          for (let i = 0; i < item.track.artists.length; i++) {
            if (item.track.artists[i].id === artistID) {
              return item;
            }
          }
        });
        if (!user || !user.recentlyPlayed || !user.recentlyPlayed.length) {
          res.status(204);
          return;
        }
        // response schema
        let response = {
          artist: {
            followers: "",
            genres: [],
            name: "",
            image: "",
            link: "",
          },
          overview: plays(user),
          tracks: tracks(user.recentlyPlayed),
        };

        for (let i = 0; i < user.recentlyPlayed[0].track.artists.length; i++) {
          if (user.recentlyPlayed[0].track.artists[i].id === artistID) {
            response.artist.name = user.recentlyPlayed[0].track.artists[i].name;
            response.artist.link =
              user.recentlyPlayed[0].track.artists[i].external_urls.spotify;
          }
        }
        fetch(`https://api.spotify.com/v1/artists/${artistID}`, {
          headers: {
            Authorization: "Bearer " + user.lastSpotifyToken,
          },
        })
          .catch((err) => {
            response.message = err.message;
            res.status(200).json(response);
          })
          .then(async (body) => {
            if (!body) {
              return;
            }
            body = await body.json();
            if (body.error) {
              response.message = `${body.error.message} [${body.error.status}]`;
              res.status(200).json(response);
              return;
            }
            response.artist.followers = body.followers.total;
            response.artist.genres = body.genres;
            response.artist.image = body.images.length
              ? body.images[0].url
              : "";
            res.status(200).json(response);
          });
      }
    );
  },
  album: (req, res) => {
    const _id = req.get("Authorization");
    if (!_id) {
      res.status(401).json({ message: `Unauthorized` });
      return;
    }
    const albumID = req.params.id;

    User.findOne(
      { _id },
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
        "recentlyPlayed.track.album.external_urls.spotify": 1,
      },
      (err, user) => {
        if (err) {
          res.status(408).json({ message: err.toString() });
          return;
        }
        user.recentlyPlayed = user.recentlyPlayed.filter(
          (item) => item.track.album.id === albumID
        );
        if (!user.recentlyPlayed.length) {
          res.status(204).json({});
          return;
        }

        res.status(200).json({
          album: {
            name: user.recentlyPlayed[0].track.album.name,
            image: user.recentlyPlayed[0].track.album.images[0].url,
            link: user.recentlyPlayed[0].track.album.external_urls.spotify,
          },
          overview: plays(user),
          tracks: tracks(user.recentlyPlayed),
        });
      }
    );
  },
  track: (req, res) => {
    const _id = req.get("Authorization");
    if (!_id) {
      res.status(401).json({ message: `Unauthorized` });
      return;
    }
    const trackID = req.params.id;

    User.findOne(
      { _id },
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
        "recentlyPlayed.track.external_urls.spotify": 1,
        lastSpotifyToken: 1,
      },
      (err, user) => {
        if (err) {
          res.status(408).json({ message: err.toString() });
          return;
        }

        user.recentlyPlayed = user.recentlyPlayed.filter(
          (item) => item.track.id === trackID
        );

        if (!user.recentlyPlayed.length) {
          res.status(200).json();
          return;
        }
        let response = {
          track: {
            album: {
              name: user.recentlyPlayed[0].track.album.name,
              id: user.recentlyPlayed[0].track.album.id,
            },
            artist: {
              name: user.recentlyPlayed[0].track.artists[0].name,
              id: user.recentlyPlayed[0].track.artists[0].id,
            },
            name: user.recentlyPlayed[0].track.name,
            image: user.recentlyPlayed[0].track.album.images[0].url,
            link: user.recentlyPlayed[0].track.external_urls.spotify,
            duration_ms: user.recentlyPlayed[0].track.duration_ms,
          },
          overview: plays(user),
        };
        fetch(`https://api.spotify.com/v1/tracks/${trackID}`, {
          headers: {
            Authorization: "Bearer " + user.lastSpotifyToken,
          },
        })
          .catch((err) => {
            response.message = err.message;
            res.status(200).json(response);
          })
          .then(async (body) => {
            if (!body) {
              return;
            }
            body = await body.json();
            if (body.error) {
              response.message = `${body.error.message} [${body.error.status}]`;
              res.status(200).json(response);
              return;
            }
            response.track.release = body.album.release_date;
            res.status(200).json(response);
          });
      }
    );
  },
};

const plays = (user) => {
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
