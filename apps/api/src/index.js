import app from "./app.js"

const port = process.env.PORT || 8888

app.listen({ port, host: "0.0.0.0" }, (err) => {
  if (err) return console.error(err)
  console.info(`Docs are available on: http://localhost:${port}/docs`)
})

const isProduction = process.env.NODE_ENV == "production"
if (isProduction) startScheduledJobs()

async function startScheduledJobs() {
  const { default: cron } = await import("node-cron")

  const cronPath = "#src/includes/cron-workers/"

  const { refreshTokens } = await import(cronPath + "tokens.js")
  const { parseHistory } = await import(cronPath + "recentlyPlayed.js")
  const { refreshAvatars } = await import(cronPath + "avatars.js")
  const { parseGenres } = await import(cronPath + "genres.js")

  await refreshTokens()
  await parseHistory()

  cron.schedule("*/30 * * * *", refreshTokens) // every 30 min
  cron.schedule("*/5 * * * *", parseHistory) // every 5 min
  cron.schedule("0 */12 * * *", refreshAvatars) // every 12 hours
  cron.schedule("0 0 * * MON", parseGenres) // every monday
}
