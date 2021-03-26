const User = require("../models/User.js");
const request = require("request");
require("dotenv").config();

function refresh_tokens() {
  const start = new Date();
  function rewriteTokens(refresh_token, spotifyID, cb) {
    let refreshOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        refresh_token,
        grant_type: "refresh_token",
      },
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.SPOTIFY_CLIENT_ID +
              ":" +
              process.env.SPOTIFY_CLIENT_SECRET
          ).toString("base64"),
      },
      json: true,
    };

    request.post(refreshOptions, async function(error, response, body) {
      if (error) {
        console.log(error);
        return;
      }

      const filter = { spotifyID };
      const update = {
        lastSpotifyToken: body.access_token,
      };

      await User.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true,
      });
      cb();
    });
  }

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
      console.log(
        `All ${users.length} tokens refreshed at ` +
          new Date()
            .toLocaleString("en-US", { timeZone: "Asia/Almaty" })
      );
      const end = new Date();
      console.log(
        "Operation took " +
          ((end.getTime() - start.getTime()) / 1000).toFixed(2) +
          " sec"
      );
    });
  });
}

module.exports = refresh_tokens;
