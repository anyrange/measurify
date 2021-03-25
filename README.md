# spotify-worm

![GitHub last commit](https://img.shields.io/github/last-commit/anyrange/spotify-worm)
![License](https://img.shields.io/github/license/anyrange/spotify-worm.svg)
![Heroku](https://pyheroku-badge.herokuapp.com/?app=spotify-worm-server&style=flat)
[![Netlify Status](https://api.netlify.com/api/v1/badges/ef6c00e5-6460-4dc9-8f96-938af86d872a/deploy-status)](https://app.netlify.com/sites/spotiworm/deploys)

> Just another app using Spotify Web API

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
