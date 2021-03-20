const express = require("express");
const router = express.Router();
const auth = require("./auth");
const User = require("./models/User");
require("dotenv").config();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello, you're not supposed to be here",
  });
});

router.get("/login", auth.login);
router.get("/callback", auth.callback);
router.get("/getAccessToken", auth.getAccessToken);

router.get("/getPlayedHistory", (req, res) => {
  const spotifyID = req.query.spotifyID;
  const projection = {
    recentlyPlayed: 1,
  };
  User.findOne({ spotifyID }, projection, (err, user) => {
    if (err) {
      console.log(err);
      return;
    }

    let formatedRecentlyPlayed = [
      user.toJSON().recentlyPlayed.map(({ played_at, track }) => {
        let album = {};
        album.name = track.album.name;
        album.id = track.album.id;

        let artists = track.artists.map(({ name, id }) => {
          return { name, id };
        });

        let name = track.name;
        let id = track.id;
        let duration = track.duration_ms / 1000;

        return { played_at, album, artists, name, id, duration };
      }),
    ];

    res.end(JSON.stringify(formatedRecentlyPlayed));
  });
});

module.exports = router;
