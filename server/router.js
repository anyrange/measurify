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
    _id: 0,

    "recentlyPlayed.track.album.id": 1,
    "recentlyPlayed.track.album.name": 1,
    "recentlyPlayed.track.artists.id": 1,
    "recentlyPlayed.track.artists.name": 1,
    "recentlyPlayed.track.duration_ms": 1,  
    "recentlyPlayed.track.id": 1,
    "recentlyPlayed.track.name": 1,
    "recentlyPlayed.played_at": 1,
  }
  
  User.findOne({ spotifyID }, projection, (err, user) => {
    if (err) {
      console.log(err);
      return;
    }

    let formatedRecentlyPlayed = user
      .toJSON()
      .recentlyPlayed.map(({ played_at, track }) => {
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
      });

    let tracks = { tracks: formatedRecentlyPlayed };
    res.end(JSON.stringify(tracks));
  });
});

module.exports = router;
