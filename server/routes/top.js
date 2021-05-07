const User = require("../models/User");
const fetch = require("node-fetch");
const { ObjectId } = require("mongodb");

const top = async (req, res) => {
  try {
    const _id = req.get("Authorization");
    const range = Number.parseInt(req.query.range) || 20;
    const firstDate = req.query.firstDate;
    let lastDate = req.query.lastDate;
    const document = await User.findOne(
      { _id },
      { recentlyPlayed: { $slice: ["$recentlyPlayed", 1] } }
    );

    if (!document.recentlyPlayed || !document.recentlyPlayed.length) {
      res.status(204).json();
      return;
    }

    if (lastDate) {
      lastDate = new Date(lastDate);
      lastDate.setDate(lastDate.getDate() + 1);
      lastDate = lastDate.toISOString().split("T")[0];
    }

    let response = {};

    response.tracks = await tracks(_id, firstDate, lastDate, range);
    response.albums = await albums(_id, firstDate, lastDate, range);
    response.artists = await artists(_id, firstDate, lastDate, range);
    response.playlists = await playlists(_id, firstDate, lastDate, range);

    const requests = response.playlists.map((playlist) => {
      return new Promise((resolve) => {
        addPlaylistInfo(playlist, resolve);
      }).then((res) => {
        if (!res) return;
        response.playlists.push(res);
      });
    });

    response.playlists = [];
    Promise.all(requests).then(async () => {
      response.playlists.sort(function(a, b) {
        if (a.playtime < b.playtime) {
          return 1;
        }
        if (a.playtime > b.playtime) {
          return -1;
        }
        return 0;
      });
      const body = await fetch(
        `https://api.spotify.com/v1/artists?ids=${response.artists
          .map((artist) => artist.id)
          .join()}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + response.artists[0].access_token,
          },
        }
      );

      const bodyJSON = await body.json();
      if (bodyJSON.error) {
        response.artists.forEach((artist) => {
          delete artist.access_token;
          artist.image = "";
        });
        res.status(200).json(response);
        throw new Error(bodyJSON.error);
      }
      response.artists.forEach((artist, index) => {
        delete artist.access_token;
        if (
          bodyJSON.artists[index].images.length &&
          bodyJSON.artists[index].images[2]
        ) {
          artist.image = bodyJSON.artists[index].images[2].url;
        }
      });
      res.status(200).json(response);
    });
  } catch (e) {
    res.status(404).json({ message: "Something went wrong!" });
    console.log(e);
  }
};
const tracks = async (_id, firstDate, lastDate, range) => {
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
        "recentlyPlayed.image": 1,
        "recentlyPlayed.duration_ms": 1,
        "recentlyPlayed.id": 1,
        "recentlyPlayed.name": 1,
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
        "recentlyPlayed.played_at": {
          $gte: firstDate || "1488-12-22",
          $lte: lastDate || "5427-12-22",
        },
      },
    },
    {
      $group: {
        _id: {
          id: "$recentlyPlayed.id",
          name: "$recentlyPlayed.name",
          image: "$recentlyPlayed.image",
        },
        playtime: {
          $sum: "$recentlyPlayed.duration_ms",
        },
      },
    },
    {
      $sort: {
        playtime: -1,
      },
    },
    {
      $limit: range,
    },
  ];
  const tracks = await User.aggregate(agg);

  return tracks.map((track) => {
    return {
      id: track._id.id,
      image: track._id.image,
      name: track._id.name,
      playtime: Math.round(track.playtime / 1000 / 60),
    };
  });
};

const albums = async (_id, firstDate, lastDate, range) => {
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
        "recentlyPlayed.album.id": 1,
        "recentlyPlayed.album.name": 1,
        "recentlyPlayed.image": 1,
        "recentlyPlayed.duration_ms": 1,
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
        "recentlyPlayed.played_at": {
          $gte: firstDate || "1488-12-22",
          $lte: lastDate || "5427-12-22",
        },
      },
    },
    {
      $group: {
        _id: {
          id: "$recentlyPlayed.album.id",
          name: "$recentlyPlayed.album.name",
          image: "$recentlyPlayed.image",
        },
        playtime: {
          $sum: "$recentlyPlayed.duration_ms",
        },
      },
    },
    {
      $sort: {
        playtime: -1,
      },
    },
    {
      $limit: range,
    },
  ];
  const albums = await User.aggregate(agg);

  return albums.map((track) => {
    return {
      id: track._id.id,
      image: track._id.image,
      name: track._id.name,
      playtime: Math.round(track.playtime / 1000 / 60),
    };
  });
};

const playlists = async (_id, firstDate, lastDate, range) => {
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
        "recentlyPlayed.context": 1,
        "recentlyPlayed.duration_ms": 1,
        lastSpotifyToken: 1,
      },
    },
    {
      $unwind: {
        path: "$recentlyPlayed",
      },
    },
    {
      $match: {
        "recentlyPlayed.played_at": {
          $gte: firstDate || "1488-12-22",
          $lte: lastDate || "5427-12-22",
        },
        "recentlyPlayed.context": { $ne: null },
      },
    },
    {
      $group: {
        _id: {
          id: "$recentlyPlayed.context.id",
          access_token: "$lastSpotifyToken",
        },
        playtime: {
          $sum: "$recentlyPlayed.duration_ms",
        },
      },
    },
    {
      $sort: {
        playtime: -1,
      },
    },
    {
      $limit: range,
    },
  ];
  let playlists = await User.aggregate(agg);

  return playlists.map((track) => {
    return {
      id: track._id.id,
      access_token: track._id.access_token,
      playtime: Math.round(track.playtime / 1000 / 60),
    };
  });
};

const artists = async (_id, firstDate, lastDate, range) => {
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
        "recentlyPlayed.artists.name": 1,
        "recentlyPlayed.artists.id": 1,
        "recentlyPlayed.duration_ms": 1,
        lastSpotifyToken: 1,
      },
    },
    {
      $unwind: {
        path: "$recentlyPlayed",
      },
    },
    {
      $match: {
        "recentlyPlayed.played_at": {
          $gte: firstDate || "1488-12-22",
          $lte: lastDate || "5427-12-22",
        },
      },
    },
    {
      $group: {
        _id: {
          id: { $arrayElemAt: ["$recentlyPlayed.artists.id", 0] },
          name: { $arrayElemAt: ["$recentlyPlayed.artists.name", 0] },
          access_token: "$lastSpotifyToken",
        },
        playtime: {
          $sum: "$recentlyPlayed.duration_ms",
        },
      },
    },
    {
      $sort: {
        playtime: -1,
      },
    },
    {
      $limit: range,
    },
  ];

  const artists = await User.aggregate(agg);
  return artists.map((track) => {
    return {
      id: track._id.id,
      name: track._id.name,
      access_token: track._id.access_token,
      playtime: Math.round(track.playtime / 1000 / 60),
    };
  });
};

const addPlaylistInfo = (playlist, cb) => {
  fetch(`https://api.spotify.com/v1/playlists/${playlist.id}`, {
    method: "GET",
    headers: { Authorization: "Bearer " + playlist.access_token },
  }).then(async (body) => {
    if (!body) return;

    body = await body.json();

    if (body.error) {
      cb();
      return;
    }
    cb({
      name: body.name,
      id: body.id,
      image: body.images ? body.images[0].url : "",
      playtime: playlist.playtime,
    });
  });
};

module.exports = top;
