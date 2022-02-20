import app from "./app.js";
import cron from "node-cron";
import refresh_tokens from "./includes/cron-workers/refresh-tokens.js";
import refresh_recently_played from "./includes/cron-workers/recently-played-parse.js";
import refresh_avatars from "./includes/cron-workers/refresh-avatars.js";
import parse_genres from "./includes/cron-workers/parse-genres.js";

const PORT = process.env.PORT || 8888;

app.listen(PORT, "0.0.0.0", (err) => {
  if (err) return console.log(err);
  console.info(
    `App listening on: http://localhost:${PORT}
Docs are available on: http://localhost:${PORT}/docs`
  );
});

if (process.env.NODE_ENV == "production") startScheduledJobs();
function startScheduledJobs() {
  refresh_tokens();
  refresh_recently_played();
  refresh_avatars();

  cron.schedule("*/30 * * * *", () => {
    refresh_tokens();
  });
  cron.schedule("*/5 * * * *", () => {
    refresh_recently_played();
  });
  cron.schedule("0 */12 * * *", () => {
    refresh_avatars();
  });
  cron.schedule("0 0 ? * MON", () => {
    parse_genres();
  });
}
