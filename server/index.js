const express = require("express");
const router = require("./router");
const mongoose = require("mongoose");
const CronJob = require("cron").CronJob;
const refresh_tokens = require("./includes/refresh-tokens.js");
const refresh_recently_played = require("./includes/recently-played-parse.js");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8888;
const FRONTEND_URI = process.env.FRONTEND_URI;

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
});

let corsOptions = {};
if (process.env.NODE_ENV == "production") {
  const whitelist = [FRONTEND_URI];
  corsOptions = {
    origin: function(origin, callback) {
      if (!origin) return callback(null, true);
      if (whitelist.indexOf(origin) === -1) {
        const message =
          "The CORS policy for this origin doesnt allow access from the particular origin.";
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  };
}
app.use(cors(corsOptions));

app.use(router);

mongoose.connect(
  process.env.DB_URI,
  { useNewUrlParser: true, useFindAndModify: false },
  () => console.log(`Database successfully connected`)
);

function startScheduledJobs() {
  const job1 = new CronJob(
    "0 55 * * * *",
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
