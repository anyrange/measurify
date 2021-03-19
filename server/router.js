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
    res.end(JSON.stringify(user.toJSON().recentlyPlayed));
  });
});

module.exports = router;
