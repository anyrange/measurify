# spotify-worm

![GitHub last commit](https://img.shields.io/github/last-commit/anyrange/spotify-worm)
![License](https://img.shields.io/github/license/anyrange/spotify-worm.svg)
![Heroku](https://pyheroku-badge.herokuapp.com/?app=spotify-worm-server&style=flat)
[![Netlify Status](https://api.netlify.com/api/v1/badges/2b93b34b-9fc4-47e4-ab20-bca6b8d6c6dd/deploy-status)](https://app.netlify.com/sites/spotiworm/deploys)

> Yet another app using Spotify Web API

## Development

### Setup environemnt

```bash
$ git clone https://github.com/anyrange/spotify-worm.git
$ cd spotify-worm
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

`Heroku` will run properly automatically,
but don't forget to configure config vars

## License

MIT
