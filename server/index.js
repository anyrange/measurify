const express = require("express");
const router = require("./router");
const cors = require("cors");
const mongoose = require("mongoose");
const schedule = require("node-schedule");
const User = require("./models/User");
const request = require("request");

const app = express();
const PORT = process.env.PORT || 8888;
app.listen(PORT);
app.use(cors());
app.use(router);

console.log(`App listening on port: ${PORT}`);

mongoose.connect(
  process.env.DB_URI,
  { useNewUrlParser: true, useFindAndModify: false },
  () => console.log(`Database Successfully Connected`)
);

schedule.scheduleJob("* */55 * * * *", function(req, res) {
  User.find({}, (err, users) => {
    users.forEach((user) => {
      console.log(user.refreshToken);
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
  });
});
