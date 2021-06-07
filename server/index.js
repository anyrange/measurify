import app from "./app.js";
import "./db.js";
import cron from "node-cron";
import refresh_tokens from "./includes/refresh-tokens.js";
import refresh_recently_played from "./includes/recently-played-parse.js";
import * as smartPlaylist from "./includes/smart-playlist.js";

const PORT = process.env.PORT || 8888;

app.listen(PORT, "0.0.0.0", (err) => {
  if (err) return console.log(err);
  console.info(`App listening on: http://localhost:${PORT}`);
});

if (process.env.NODE_ENV == "production") startScheduledJobs();

if (process.env.NODE_ENV != "production")
  app.ready(() => {
    console.log(app.printRoutes({ commonPrefix: false }));
  });

function startScheduledJobs() {
  refresh_tokens();
  // refresh_recently_played();
  cron.schedule("*/30 * * * *", () => {
    refresh_tokens();
  });
  cron.schedule("*/10 * * * *", () => {
    refresh_recently_played();
  });

  cron.schedule("0 0 * * *", () => {
    smartPlaylist.update();
  });
  cron.schedule("*/15 * * * *", () => {
    smartPlaylist.clean();
  });
}
