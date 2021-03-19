const request = require("request");
const User = require("../models/User");
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
      const recentlyPlayedOptions = {
        uri: "https://api.spotify.com/v1/me/player/recently-played?limit=50",
        headers: {
          Authorization: "Bearer " + user.lastSpotifyToken,
        },
        json: true,
      };

      //   User.find({"userName": user.userName}, (err, t)=>{console.log(t)}).sort({recentlyPlayed:-1}).limit(1);

      if (!user.recentlyPlayed.length) {
        request.get(recentlyPlayedOptions, async (error, response, body) => {
          const query = { spotifyID: user.spotifyID };
          const update = {
            recentlyPlayed: body.items,
          };

          await User.updateOne(query, update);
          process.exit();
        });
      }
      
    }
  });
});
