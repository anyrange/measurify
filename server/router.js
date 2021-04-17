const express = require("express");
const router = express.Router();
const auth = require("./routes/auth");
const friends = require("./routes/friends");
const getOverview = require("./routes/getOverview");
const getPlayedHistory = require("./routes/getPlayedHistory");
const infoPages = require("./routes/infoPages");
const top = require("./routes/top");
const users = require("./routes/users");
const authMiddleware = require("./middlewares/authMiddleware");
require("dotenv").config();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello, you're not supposed to be here",
  });
});

router.get("/login", auth.login);
router.get("/callback", auth.callback);
router.get("/token", authMiddleware, auth.getAccessToken);

router.get("/listening-history", authMiddleware, getPlayedHistory);

router.get("/friends", authMiddleware, friends);
router.get("/users", users);

router.get("/overview", authMiddleware, getOverview);
router.get("/top", authMiddleware, top);

router.get("/artist/:id", authMiddleware, infoPages.artist);
router.get("/album/:id", authMiddleware, infoPages.album);
router.get("/track/:id", authMiddleware, infoPages.track);

module.exports = router;
