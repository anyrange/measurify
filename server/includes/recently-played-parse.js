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
        reject(user.userName, err);
        return;
      })
      .then((res) => res.json())
      .then(async (body) => {
        if (body.error) {
          reject(user.userName, body.error.message);
          return;
        }
        if (!body.items.length) {
          cb();
          return;
        }
        body.items.forEach((item) => {
          delete item.track.available_markets;
          delete item.track.album.available_markets;
        });

        if (!user.recentlyPlayed.length) {
          const query = { spotifyID: user.spotifyID };
          const update = {
            recentlyPlayed: body.items,
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
          newSongs.push(body.items[i]);
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
      console.log(
        `All ${requests.length} histories updated at ` +
          new Date().toLocaleString("en-US", { timeZone: "Asia/Almaty" })
      );
      const end = new Date();
      console.log(
        `Operation took ${((end.getTime() - start.getTime()) / 1000).toFixed(
          2
        )} sec`
      );
    });

    // ## CHAIN EXECUTION (1 TASK->2 TASK->3 TASK->4 TASK)
    // let requests = users.reduce((promiseChain, user) => {
    //   return promiseChain.then(
    //     () =>
    //       new Promise((resolve) => {
    //         parseRecentlyPlayed(user, resolve);
    //       })
    //   );
    // }, Promise.resolve());

    // requests.then(() => {
    //   console.log(`All ${users.length} histories updated`);
    //   process.exit();
    // });
  });
}

module.exports = refresh_recently_played;
