const User = require("../models/User");
const fetch = require("node-fetch");
const { ObjectId } = require("mongodb");

const infoPages = {
  artist: async (req, res) => {
    const _id = req.get("Authorization");
    const artistID = req.params.id;
    const agg = [
      {
        $match: {
          _id: new ObjectId(_id),
        },
      },
      {
        $project: {
          _id: 0,
          "recentlyPlayed.track.artists.id": 1,
          "recentlyPlayed.track.id": 1,
          "recentlyPlayed.track.name": 1,
          "recentlyPlayed.track.duration_ms": 1,
          "recentlyPlayed.played_at": 1,
          lastSpotifyToken: 1,
        },
      },
      {
        $unwind: {
          path: "$recentlyPlayed",
          includeArrayIndex: "arrayIndex",
        },
      },
      {
        $match: {
          "recentlyPlayed.track.artists.id": artistID,
        },
      },
    ];

    const tracks = await User.aggregate(agg);

    if (!tracks || !tracks.length) {
      res.status(204).json();
      return;
    }
    // response schema

    fetch(`https://api.spotify.com/v1/artists/${artistID}`, {
      headers: {
        Authorization: "Bearer " + tracks[0].lastSpotifyToken,
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
        let response = {
          artist: {
            followers: body.followers.total,
            genres: body.genres,
            name: body.name,
            image: body.images.length ? body.images[0].url : "",
            link: body.external_urls.spotify,
          },
          overview: plays(tracks),
          tracks: await history(_id, artistID),
        };
        res.status(200).json(response);
      });
  },
  album: async (req, res) => {
    const _id = req.get("Authorization");
    const albumID = req.params.id;
    const agg = [
      {
        $match: {
          _id: new ObjectId(_id),
        },
      },
      {
        $project: {
          _id: 0,
          "recentlyPlayed.track.artists.id": 1,
          "recentlyPlayed.track.artists.name": 1,
          "recentlyPlayed.track.album.external_urls.spotify": 1,
          "recentlyPlayed.track.album.images.url": 1,
          "recentlyPlayed.track.album.id": 1,
          "recentlyPlayed.track.album.name": 1,
          "recentlyPlayed.track.duration_ms": 1,
          "recentlyPlayed.track.id": 1,
          "recentlyPlayed.track.name": 1,
          "recentlyPlayed.played_at": 1,
        },
      },
      {
        $unwind: {
          path: "$recentlyPlayed",
          includeArrayIndex: "arrayIndex",
        },
      },
      {
        $match: {
          "recentlyPlayed.track.album.id": albumID,
        },
      },
    ];

    const tracks = await User.aggregate(agg);

    if (!tracks || !tracks.length) {
      res.status(204).json();
      return;
    }

    res.status(200).json({
      album: {
        name: tracks[0].recentlyPlayed.track.album.name,
        image: tracks[0].recentlyPlayed.track.album.images[0].url,
        link: tracks[0].recentlyPlayed.track.album.external_urls.spotify,
        artist: {
          name: tracks[0].recentlyPlayed.track.artists[0].name,
          id: tracks[0].recentlyPlayed.track.artists[0].id,
        },
      },
      overview: plays(tracks),
      tracks: await history(_id, albumID),
    });
  },
  track: async (req, res) => {
    const _id = req.get("Authorization");
    const trackID = req.params.id;
    const agg = [
      {
        $match: {
          _id: new ObjectId(_id),
        },
      },
      {
        $project: {
          _id: 0,
          "recentlyPlayed.track.artists.id": 1,
          "recentlyPlayed.track.artists.name": 1,
          "recentlyPlayed.track.external_urls.spotify": 1,
          "recentlyPlayed.track.album.images.url": 1,
          "recentlyPlayed.track.album.id": 1,
          "recentlyPlayed.track.album.name": 1,
          "recentlyPlayed.track.duration_ms": 1,
          "recentlyPlayed.track.id": 1,
          "recentlyPlayed.track.name": 1,
          "recentlyPlayed.played_at": 1,
          lastSpotifyToken: 1,
        },
      },
      {
        $unwind: {
          path: "$recentlyPlayed",
          includeArrayIndex: "arrayIndex",
        },
      },
      {
        $match: {
          "recentlyPlayed.track.id": trackID,
        },
      },
    ];

    const tracks = await User.aggregate(agg);

    if (!tracks || !tracks.length) {
      res.status(204).json();
      return;
    }

    let response = {
      track: {
        album: {
          name: tracks[0].recentlyPlayed.track.album.name,
          id: tracks[0].recentlyPlayed.track.album.id,
        },
        artist: {
          name: tracks[0].recentlyPlayed.track.artists[0].name,
          id: tracks[0].recentlyPlayed.track.artists[0].id,
        },
        name: tracks[0].recentlyPlayed.track.name,
        image: tracks[0].recentlyPlayed.track.album.images[0].url,
        link: tracks[0].recentlyPlayed.track.external_urls.spotify,
        duration_ms: tracks[0].recentlyPlayed.track.duration_ms,
      },
      overview: plays(tracks),
    };
    fetch(`https://api.spotify.com/v1/tracks/${trackID}`, {
      headers: {
        Authorization: "Bearer " + tracks[0].lastSpotifyToken,
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
  },
};

const plays = (tracks) => {
  let recentlyPlayed = tracks.map(({ recentlyPlayed }) => {
    let date = recentlyPlayed.played_at.split("T")[0];
    let duration = recentlyPlayed.track.duration_ms / 1000 / 60;
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

  return plays;
};

const history = async (_id, filterId) => {
  const agg = [
    {
      $match: {
        _id: ObjectId(_id),
      },
    },
    {
      $project: {
        _id: 0,
        "recentlyPlayed.played_at": 1,
        "recentlyPlayed.track.artists.id": 1,
        "recentlyPlayed.track.album.id": 1,
        "recentlyPlayed.track.duration_ms": 1,
        "recentlyPlayed.track.id": 1,
        "recentlyPlayed.track.name": 1,
      },
    },
    {
      $unwind: {
        path: "$recentlyPlayed",
        includeArrayIndex: "arrayIndex",
      },
    },
    {
      $match: {
        $or: [
          { "recentlyPlayed.track.artists.id": filterId },
          { "recentlyPlayed.track.album.id": filterId },
        ],
      },
    },
    {
      $group: {
        _id: {
          id: "$recentlyPlayed.track.id",
          name: "$recentlyPlayed.track.name",
        },
        playtime: {
          $sum: "$recentlyPlayed.track.duration_ms",
        },
      },
    },
    {
      $sort: {
        playtime: -1,
      },
    },
    {
      $limit: 20,
    },
  ];
  const tracks = await User.aggregate(agg);
  console.log(tracks);
  return tracks.map((track) => {
    return {
      id: track._id.id,
      name: track._id.name,
      playtime: Math.round(track.playtime / 1000 / 60),
    };
  });
};

module.exports = infoPages;
