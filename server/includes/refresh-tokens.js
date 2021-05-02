const User = require("../models/User.js");
const fetch = require("node-fetch");
const { URLSearchParams } = require("url");
require("dotenv").config();

function refresh_tokens() {
  const start = new Date();

  User.find({}, { _id: 0, refreshToken: 1, spotifyID: 1 }, (err, users) => {
    if (err) {
      console.log(err);
      return;
    }

    let requests = users.map((user) => {
      return new Promise((resolve) => {
        rewriteTokens(user.refreshToken, user.spotifyID, resolve);
      });
    });

    Promise.all(requests).then(() => {
      const end = new Date();
      console.log(
        `--All ${requests.length} tokens refreshed in ${(
          (end.getTime() - start.getTime()) /
          1000
        ).toFixed(2)} sec [${new Date().toLocaleString("en-US", {
          timeZone: "Asia/Almaty",
        })}]--`
      );
    });
  });

  function rewriteTokens(refresh_token, spotifyID, cb) {
    const params = new URLSearchParams();
    params.append("grant_type", "refresh_token");
    params.append("refresh_token", refresh_token);

    fetch(`https://accounts.spotify.com/api/token`, {
      method: "POST",
      body: params,
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.SPOTIFY_CLIENT_ID +
              ":" +
              process.env.SPOTIFY_CLIENT_SECRET
          ).toString("base64"),
      },
    })
      .then(async (body) => {
        if (!body) {
          return;
        }
        body = await body.json();
        if (body.error) {
          console.log("user " + spotifyID + " havent got his token");
          console.log("message: " + body.error.message);
          cb();
          return;
        }

        await User.updateOne(
          { spotifyID },
          {
            lastSpotifyToken: body.access_token,
          }
        );
        cb();
      })
      .catch((err) => {
        console.log("user " + spotifyID + " havent got his token");
        console.log(err.message);
        cb();
      });
  }
}

module.exports = refresh_tokens;
