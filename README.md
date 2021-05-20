# spotiworm

[![Uptime Robot status](https://img.shields.io/uptimerobot/status/m787497444-7b36a8b8a8545c2335febb2b)](https://stats.uptimerobot.com/kXD0runRnw/787497444)
[![Netlify](https://img.shields.io/netlify/2b93b34b-9fc4-47e4-ab20-bca6b8d6c6dd)](https://app.netlify.com/sites/spotiworm/deploys)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/anyrange/spotiworm/server-ci?label=server-ci)](https://github.com/anyrange/spotiworm/actions/workflows/main.yml)

> Yet another app using Spotify Web API

## Development

### Setup environemnt

```bash
$ git clone https://github.com/anyrange/spotiworm.git
$ cd spotiworm
$ npm install
$ npm run dev
```

### Environment variables

Rename [.env.example](/.env.example) to `.env` and don't forget to set your variables

### Deployment

You can use heroku + netlify setup

`Netlify` configuration

```
Build command: npm run build
Publish directory: dist/
```

`Heroku` will run properly automatically

## License

MIT
