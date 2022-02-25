import app from "./app.js";

const PORT = process.env.PORT || 8888;

app.listen(PORT, "0.0.0.0", (err) => {
  if (err) return console.log(err);
  console.info(`Docs are available on: http://localhost:${PORT}/docs`);
});

if (process.env.NODE_ENV == "production") startScheduledJobs();

async function startScheduledJobs() {
  const { default: cron } = await import("node-cron");

  const cronPath = "#server/includes/cron-workers/";

  const { refreshTokens } = await import(cronPath + "tokens.js");
  const { parseHistory } = await import(cronPath + "recentlyPlayed.js");
  const { refreshAvatars } = await import(cronPath + "avatars.js");
  const { parseGenres } = await import(cronPath + "genres.js");

  refreshTokens().then(() => {
    parseHistory();
    refreshAvatars();
  });

  cron.schedule("*/30 * * * *", refreshTokens); // every 30 min
  cron.schedule("*/5 * * * *", parseHistory); // every 5 min
  cron.schedule("0 */12 * * *", refreshAvatars); // every 12 hours
  cron.schedule("0 0 * * MON", parseGenres); // every monday
}
