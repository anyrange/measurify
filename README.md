# measurify

Yet another app using Spotify Web API

[![Uptime Robot](https://img.shields.io/uptimerobot/status/m787497444-7b36a8b8a8545c2335febb2b?label=heroku)](https://stats.uptimerobot.com/kXD0runRnw/787497444)
[![Netlify](https://img.shields.io/netlify/2b93b34b-9fc4-47e4-ab20-bca6b8d6c6dd)](https://app.netlify.com/sites/spotiworm/deploys)

## Build Setup

**Requires Node.js 16+ and pnpm (preferably)**

```bash
# install dependencies
pnpm install # or npm/yarn

# run client and server concurrently
pnpm dev

# or separately using commands
pnpm client
pnpm server
```

### Environment variables

Rename [.env.example](/.env.example) to `.env` and don't forget to set your variables

### API documentation

Starting the app will let you investigate the API via Swagger by getting detailed information about endpoints, and their request/response schemas at [http://localhost:8887/docs](http://localhost:8887/docs)

![Swagger](https://i.imgur.com/fULUHZr.png)

## Contributing

Contributions are welcome. Just submit a pull request or open an issue

## License

[MIT](/LICENSE)
