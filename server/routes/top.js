const User = require("../models/User");
const fetch = require("node-fetch");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const top = async (req, res) => {
  try {
    let _id = req.get("Authorization");
    if (!_id) {
      res.status(401).json({ message: `Unauthorized` });
      return;
    }
    const firstDate = req.query.firstDate;
    let lastDate = req.query.lastDate;

    if (lastDate) {
      lastDate = new Date(lastDate);
      lastDate.setDate(lastDate.getDate() + 1);
      lastDate = lastDate.toISOString().split("T")[0];
    }

    let response = {};

    response.tracks = await tracks(_id, firstDate, lastDate);
    response.albums = await albums(_id, firstDate, lastDate);
    response.artists = await artists(_id, firstDate, lastDate);
    response.playlists = await playlists(_id, firstDate, lastDate);

    const requests = response.playlists.map((playlist) => {
      return new Promise((resolve) => {
        addPlaylistInfo(playlist, resolve);
      }).then((res) => {
        if (!res) return;

        response.playlists.push({
          name: res.name,
          id: res.id,
          image: res.images.length ? res.images[0].url : "",
          playtime: res.playtime,
        });
      });
    });

    response.playlists = [];

    Promise.all(requests).then(() => {
      response.playlists.sort(function(a, b) {
        if (a.playtime < b.playtime) {
          return 1;
        }
        if (a.playtime > b.playtime) {
          return -1;
        }
        return 0;
      });
      fetch(
        `https://api.spotify.com/v1/artists?ids=${response.artists
          .map((artist) => artist.id)
          .join()}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + response.artists[0].access_token,
          },
        }
      )
        .catch((err) => {
          response.message = err.message;
          res.status(200).json(response);
        })
        .then(async (body) => {
          if (!body) return;
          body = await body.json();
          if (body.error) {
            response.message = `${body.error.message} [${body.error.status}]`;
            res.status(200).json(response);
            return;
          }
          response.artists.forEach((artist, index) => {
            delete artist.access_token;
            if (
              body.artists[index].images.length &&
              body.artists[index].images[2]
            ) {
              artist.image = body.artists[index].images[2].url;
            }
          });
          res.status(200).json(response);
        });
    });
  } catch (e) {
    console.log(e);
  }
};

const tracks = async (_id, firstDate, lastDate) => {
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
        "recentlyPlayed.track.album.images.url": 1,
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
        "recentlyPlayed.played_at": {
          $gte: firstDate || "1488-12-22",
          $lte: lastDate || "5427-12-22",
        },
      },
    },
    {
      $group: {
        _id: {
          id: "$recentlyPlayed.track.id",
          name: "$recentlyPlayed.track.name",
          image: {
            $arrayElemAt: ["$recentlyPlayed.track.album.images.url", 0],
          },
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

  return tracks.map((track) => {
    return {
      id: track._id.id,
      image: track._id.image,
      name: track._id.name,
      playtime: Math.round(track.playtime / 1000 / 60),
    };
  });
};

const albums = async (_id, firstDate, lastDate) => {
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
        "recentlyPlayed.track.album.id": 1,
        "recentlyPlayed.track.album.name": 1,
        "recentlyPlayed.track.album.images.url": 1,
        "recentlyPlayed.track.duration_ms": 1,
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
          id: "$recentlyPlayed.track.album.id",
          name: "$recentlyPlayed.track.album.name",
          image: {
            $arrayElemAt: ["$recentlyPlayed.track.album.images.url", 0],
          },
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

const playlists = async (_id, firstDate, lastDate) => {
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
        "recentlyPlayed.context.type": 1,
        "recentlyPlayed.context.uri": 1,
        "recentlyPlayed.track.duration_ms": 1,
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
        "recentlyPlayed.played_at": {
          $gte: firstDate || "1488-12-22",
          $lte: lastDate || "5427-12-22",
        },
        "recentlyPlayed.context.type": "playlist",
      },
    },
    {
      $group: {
        _id: {
          id: "$recentlyPlayed.context.uri",
          access_token: "$lastSpotifyToken",
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
  let playlists = await User.aggregate(agg);

  return playlists.map((track) => {
    return {
      id: track._id.id.split(":")[2],
      access_token: track._id.access_token,
      playtime: Math.round(track.playtime / 1000 / 60),
    };
  });
};

const artists = async (_id, firstDate, lastDate) => {
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
        "recentlyPlayed.track.artists.name": 1,
        "recentlyPlayed.track.artists.id": 1,
        "recentlyPlayed.track.duration_ms": 1,
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
        "recentlyPlayed.played_at": {
          $gte: firstDate || "1488-12-22",
          $lte: lastDate || "5427-12-22",
        },
      },
    },
    {
      $group: {
        _id: {
          id: { $arrayElemAt: ["$recentlyPlayed.track.artists.id", 0] },
          name: { $arrayElemAt: ["$recentlyPlayed.track.artists.name", 0] },
          access_token: "$lastSpotifyToken",
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

  let artists = await User.aggregate(agg);

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
  })
    .catch((err) => {
      response.message = err.message;
      cb();
    })
    .then(async (body) => {
      if (!body) return;

      body = await body.json();

      if (body.error) {
        response.message = `${body.error.message} [${body.error.status}]`;
        cb();
        return;
      }
      body.playtime = playlist.playtime;
      cb(body);
    });
};

module.exports = top;

//   User.findOne(
//     {
//       _id,
//     },
//     projection,

//     async (err, user) => {
//       if (err) {
//         res.status(408).json({ message: err.toString() });
//         return;
//       }
//       let response = { albums: [], tracks: [], artists: [] };

//       if (!user || !user.recentlyPlayed || !user.recentlyPlayed.length) {
//         res.status(204).json();
//         return;
//       }
//       response.albums = await albums(user.recentlyPlayed);
//       response.tracks = await tracks(user.recentlyPlayed);
//       response.artists = await artists(user.recentlyPlayed);
//       response.playlists = await playlists(user.recentlyPlayed);

//       let requests = response.playlists.map((playlist) => {
//         return new Promise((resolve) => {
//           addPlaylistInfo(playlist, user.lastSpotifyToken, resolve);
//         }).then((res) => {
//           if (!res) return;

//           response.playlists.push({
//             name: res.name,
//             id: res.id,
//             image: res.images.length ? res.images[0].url : "",
//             playtime: res.playtime,
//           });
//         });
//       });

//       response.playlists = [];

//       Promise.all(requests).then(() => {
//         response.playlists.sort(function(a, b) {
//           if (a.playtime < b.playtime) {
//             return 1;
//           }
//           if (a.playtime > b.playtime) {
//             return -1;
//           }
//           return 0;
//         });
//         // get images for artists
//         fetch(
//           `https://api.spotify.com/v1/artists?ids=${response.artists
//             .map((artist) => artist.id)
//             .join()}`,
//           {
//             method: "GET",
//             headers: { Authorization: "Bearer " + user.lastSpotifyToken },
//           }
//         )
//           .catch((err) => {
//             response.message = err.message;
//             res.status(200).json(response);
//           })
//           .then(async (body) => {
//             if (!body) return;
//             body = await body.json();
//             if (body.error) {
//               response.message = `${body.error.message} [${body.error.status}]`;
//               res.status(200).json(response);
//               return;
//             }
//             response.artists.forEach((artist, index) => {
//               if (
//                 body.artists[index].images.length &&
//                 body.artists[index].images[2]
//               ) {
//                 artist.image = body.artists[index].images[2].url;
//               }
//             });
//             res.status(200).json(response);
//           });
//       });
//     }
//   );
// };
