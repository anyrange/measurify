const express = require("express");
const router = require("./router");
const cors = require("cors");
const mongoose = require("mongoose");
const CronJob = require("cron").CronJob;
const refresh_tokens = require("./bin/refresh-tokens.js");
const refresh_recently_played = require("./bin/recently-played-parse.js");

const app = express();
const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
});
app.use(cors());
app.use(router);

mongoose.connect(
  process.env.DB_URI,
  { useNewUrlParser: true, useFindAndModify: false },
  () => console.log(`Database Successfully Connected`)
);

const job1 = new CronJob(
  "0 */20 * * * *",
  () => {
    refresh_tokens();
  },
  null,
  true,
  "Asia/Almaty"
);

const job2 = new CronJob(
  "0 */50 * * * *",
  () => {
    refresh_recently_played();
  },
  null,
  true,
  "Asia/Almaty"
);

job1.start();
job2.start();
