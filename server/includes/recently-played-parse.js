const fetch = require("node-fetch");
const User = require("../models/User");
require("dotenv").config();

function refresh_recently_played() {
  const start = new Date();
  function parseRecentlyPlayed(user, cb, reject) {
    fetch("https://api.spotify.com/v1/me/player/recently-played?limit=15", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + user.lastSpotifyToken,
      },
    })
      .catch((err) => {
        reject(user.userName, err.message);
      })
      .then(async (body) => {
        if (!body) {
          return;
        }
        body = await body.json();
        if (body.error) {
          reject(user.userName, body.error.message);
          return;
        }
        if (!body.items.length) {
          cb();
          return;
        }

        if (!user || !user.recentlyPlayed || !user.recentlyPlayed.length) {
          const query = { spotifyID: user.spotifyID };
          const update = {
            recentlyPlayed: body.items.map((item) => formatTrack(item)),
          };
          await User.updateOne(query, update);
          cb();
          return;
        }
        let i = 0;
        let newSongs = [];
        while (
          Date.parse(user.recentlyPlayed[0].played_at) <
            Date.parse(body.items[i].played_at) &&
          i < body.items.length
        ) {
          newSongs.push(formatTrack(body.items[i]));
          i++;
        }

        const query = { spotifyID: user.spotifyID };
        const update = {
          $push: {
            recentlyPlayed: {
              $each: newSongs,
              $position: 0,
            },
          },
        };
        await User.updateOne(query, update);
        cb();
      });
  }

  const agg = [
    {
      $match: {},
    },
    {
      $project: {
        _id: 0,
        spotifyID: 1,
        lastSpotifyToken: 1,
        recentlyPlayed: {
          $slice: ["$recentlyPlayed", 1],
        },
        userName: 1,
      },
    },
    {
      $project: {
        spotifyID: 1,
        lastSpotifyToken: 1,
        userName: 1,
        "recentlyPlayed.played_at": 1,
      },
    },
  ];

  User.aggregate(agg, (err, users) => {
    if (err) {
      console.log(err);
      return;
    }

    // ## PARALLEL EXECUTION (TASKS MAY BE EXECUTED IN RANDOM ORDER)

    let requests = users.map((user) => {
      return new Promise((resolve, reject) => {
        parseRecentlyPlayed(user, resolve, reject);
      }).catch((user, error) => {
        console.log(user + " died");
        console.log("message: " + error);
      });
    });

    Promise.all(requests).then(() => {
      const end = new Date();
      console.log(
        `All ${requests.length} histories updated in ${(
          (end.getTime() - start.getTime()) /
          1000
        ).toFixed(2)} sec [${new Date().toLocaleString("en-US", {
          timeZone: "Asia/Almaty",
        })}]`
      );
    });
  });
  function formatTrack(item) {
    const track = item.track;
    const album = {
      id: track.album.id,
      name: track.album.name,
      url: track.album.external_urls.spotify,
    };
    let context = null;
    if (item.context && item.context.type === "playlist") {
      context = {
        id: item.context.uri.split(":")[2],
        url: item.context.external_urls.spotify,
      };
    }
    const artists = track.artists.map(({ id, name, external_urls }) => {
      return { id, name, url: external_urls.spotify };
    });
    return {
      id: track.id,
      name: track.name,
      duration_ms: track.duration_ms,
      popularity: track.popularity,
      url: track.external_urls.spotify,
      played_at: item.played_at,
      image:
        track.album.images && track.album.images.length
          ? track.album.images[2].url
          : "",
      album,
      context,
      artists,
    };
  }
}

module.exports = refresh_recently_played;
