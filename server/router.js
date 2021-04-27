const express = require("express");
const router = express.Router();
const routes = require("./routes");
const middlewares = require("./middlewares");
const path = require("path");

require("dotenv").config();

router.get("/", (req, res) => {
  res.status(200).sendFile(path.dirname(__filename) + "/assets/Home.html");
});
// Server state

router.get("/health", routes.health);
// Authorization
router.get("/login", routes.auth.login);
router.get("/callback", routes.auth.callback);
router.get("/token", middlewares.authMiddleware, routes.auth.getAccessToken);

// History
router.get(
  "/listening-history",
  middlewares.authMiddleware,
  routes.getPlayedHistory
);

router.get("/friends", middlewares.authMiddleware, routes.friends);
router.get("/users", routes.users);

// Settings
router.get(
  "/settings/privacy",
  middlewares.authMiddleware,
  routes.settings.getPrivacy
);
router.post(
  "/settings/privacy",
  middlewares.authMiddleware,
  routes.settings.postPrivacy
);

// User profile
router.get("/user/:id", middlewares.authMiddleware, routes.user);

// Main page
router.get("/overview", middlewares.authMiddleware, routes.getOverview);
router.get("/top", middlewares.authMiddleware, routes.top);

// infoPages
router.get("/artist/:id", middlewares.authMiddleware, routes.infoPages.artist);
router.get("/album/:id", middlewares.authMiddleware, routes.infoPages.album);
router.get("/track/:id", middlewares.authMiddleware, routes.infoPages.track);

router.all("*", function(req, res) {
  res.status(404).end("Service not found");
});

module.exports = router;
