import app from "./app.js";
import "./db.js";
import { CronJob } from "cron";
import refresh_tokens from "./includes/refresh-tokens.js";
import refresh_recently_played from "./includes/recently-played-parse.js";

const PORT = process.env.PORT || 8888;

app.listen(PORT, (err, address) => {
  if (err) return console.log(err);
  console.info(`App listening on: ${address}`);
});

function startScheduledJobs() {
  const job1 = new CronJob(
    "0 */30 * * * *",
    () => {
      refresh_tokens();
    },
    null,
    true,
    "Asia/Almaty"
  );
  const job2 = new CronJob(
    "0 */10 * * * *",
    () => {
      refresh_recently_played();
    },
    null,
    true,
    "Asia/Almaty"
  );
  job1.start();
  job2.start();
}

if (process.env.NODE_ENV == "production") {
  refresh_tokens();
  refresh_recently_played();
  startScheduledJobs();
}
