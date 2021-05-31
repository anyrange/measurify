import fetch from "node-fetch";
import User from "../models/User.js";
import formatTrack from "./format-track.js";
import dotenv from "dotenv";
dotenv.config();

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
        reject({ user: user.userName, message: err.message });
      })
      .then(async (body) => {
        if (!body) return;

        body = await body.json();

        if (body.error)
          return reject({ user: user.userName, message: body.error.message });
        if (!body.items.length) return cb();

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
          i < body.items.length &&
          Date.parse(user.recentlyPlayed[0].played_at) <
            Date.parse(body.items[i].played_at)
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
    if (err) return console.log(err);

    let requests = users.map((user) => {
      return new Promise((resolve, reject) => {
        parseRecentlyPlayed(user, resolve, reject);
      }).catch(({ user, message }) => {
        console.log(user + " died");
        console.log("message: " + message);
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
}

export default refresh_recently_played;
