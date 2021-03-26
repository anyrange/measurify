const request = require("request");
const User = require("../models/User");
require("dotenv").config();

function refresh_recently_played() {
  const start = new Date();
  function parseRecentlyPlayed(user, cb) {
    const recentlyPlayedOptions = {
      uri: "https://api.spotify.com/v1/me/player/recently-played?limit=15",
      headers: {
        Authorization: "Bearer " + user.lastSpotifyToken,
      },
      json: true,
    };

    // delete smth from all users
    // user.recentlyPlayed.forEach((item)=>delete item.track.available_markets);

    request.get(recentlyPlayedOptions, async (error, response, body) => {
      if (error) {
        consol.log(error);
        return;
      }
      body.items.forEach((item) => delete item.track.available_markets);

      if (!user.recentlyPlayed.length) {
        const query = { spotifyID: user.spotifyID };
        const update = {
          recentlyPlayed: body.items,
        };
        await User.updateOne(query, update);
        cb();
      } else {
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
        user.recentlyPlayed.unshift(...newSongs);
        const query = { spotifyID: user.spotifyID };
        const update = {
          recentlyPlayed: user.recentlyPlayed,
        };
        await User.updateOne(query, update);
        cb();
      }
    });
  }

  User.find(
    {},
    { _id: 0, spotifyID: 1, lastSpotifyToken: 1, recentlyPlayed: 1 },
    (err, users) => {
      if (err) {
        console.log(err);
        return;
      }

      // ## ONE TIME PROMISE (TASKS MAY BE EXECUTED IN RANDOM ORDER)

      let requests = users.map((user) => {
        return new Promise((resolve) => {
          parseRecentlyPlayed(user, resolve);
        });
      });

      Promise.all(requests).then(() => {
        console.log(
          `All ${users.length} histories updated at ` +
            new Date().toLocaleString("en-US", { timeZone: "Asia/Almaty" })
        );
        const end = new Date();
        console.log(
          "Operation took " +
            ((end.getTime() - start.getTime()) / 1000).toFixed(2) +
            " sec"
        );
      });

      // ## CHAIN PROMISE (1 TASK->2 TASK->3 TASK->4 TASK)
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
    }
  );
}

module.exports = refresh_recently_played;
