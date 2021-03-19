const User = require("../models/User.js");
const request = require("request");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(
  process.env.DB_URI,
  { useNewUrlParser: true, useFindAndModify: false },
  () => console.log(`Database Successfully Connected`)
);

User.find({}, (err, users) => {
  if (err) {
    console.log(err);
    return;
  }
  users.forEach((user) => {
    if (user.refreshToken) {
      let refresh_token = user.refreshToken;
      let spotifyID = user.spotifyID;
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
        console.log("New token: " + body.access_token);
        const filter = { spotifyID };
        const update = {
          lastSpotifyToken: body.access_token,
        };

        await User.findOneAndUpdate(filter, update, {
          new: true,
          upsert: true,
        });
      });
    }
  });
}).then(() => {
  mongoose.connection.close();
  process.exit();
});
