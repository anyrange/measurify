const express = require("express");
const router = express.Router();
const auth = require("./routes/auth");
const getOverview = require("./routes/getOverview");
const getPlayedHistory = require("./routes/getPlayedHistory");
require("dotenv").config();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello, you're not supposed to be here",
  });
});

router.get("/login", auth.login);
router.get("/callback", auth.callback);
router.get("/getAccessToken", auth.getAccessToken);

router.get("/getPlayedHistory", getPlayedHistory);

router.get("/getOverview", getOverview);

module.exports = router;
