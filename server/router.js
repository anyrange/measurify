const express = require("express");
const router = express.Router();
const auth = require("./routes/auth");
const friends = require("./routes/friends");
const getOverview = require("./routes/getOverview");
const getPlayedHistory = require("./routes/getPlayedHistory");
const infoPages = require("./routes/infoPages");
const top = require("./routes/top");
require("dotenv").config();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello, you're not supposed to be here",
  });
});

router.get("/login", auth.login);
router.get("/callback", auth.callback);
router.get("/token", auth.getAccessToken);

router.get("/listening-history", getPlayedHistory);
router.get("/overview", getOverview);
router.get("/friends", friends);

router.get("/top", top);

router.get("/artist/:id", infoPages.artist);
router.get("/album/:id", infoPages.album);
router.get("/track/:id", infoPages.track);

module.exports = router;
