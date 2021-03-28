const querystring = require("querystring");
const request = require("request");
const User = require("../models/User");

const redirect_uri =
  process.env.REDIRECT_URI || "http://localhost:8888/callback";

const auth = {
  login: function(req, res) {
    res.redirect(
      "https://accounts.spotify.com/authorize?" +
        querystring.stringify({
          response_type: "code",
          client_id: process.env.SPOTIFY_CLIENT_ID,
          scope:
            "user-read-private user-read-email ugc-image-upload user-top-read playlist-modify-public user-read-recently-played playlist-modify-private user-follow-read playlist-read-private user-library-read playlist-read-collaborative",
          redirect_uri,
        })
    );
  },
  getAccessToken: function(req, res) {
    let _id = req.get("Authorization");
    if (!_id) {
      res.status(400).json({ message: `Unauthorized` });
      return;
    }
    User.findOne({ _id }, (err, user) => {
      if (err) {
        res.status(400).end(err);
      }
      res.status(200).end(user.lastSpotifyToken);
    });
  },
  callback: function(req, res) {
    let code = req.query.code || null;
    let authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri,
        grant_type: "authorization_code",
      },
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.SPOTIFY_CLIENT_ID +
              ":" +
              process.env.SPOTIFY_CLIENT_SECRET
          ).toString("base64"),
      },
      json: true,
    };
    request.post(authOptions, function(error, response, body) {
      const access_token = body.access_token;
      const refresh_token = body.refresh_token;

      const uri = process.env.FRONTEND_URI || "http://localhost:3000";

      const userDataGainOptions = {
        url: "https://api.spotify.com/v1/me",
        headers: {
          Authorization: "Bearer " + access_token,
        },
      };
      const recentlyPlayedOptions = {
        url: "https://api.spotify.com/v1/me/player/recently-played?limit=50",
        headers: {
          Authorization: "Bearer " + access_token,
        },
        json: true,
      };

      request.get(userDataGainOptions, async function(err, response, body) {
        if (!err) {
          const userData = await JSON.parse(body);
          console.log(userData.display_name + " logined");

          const filter = { spotifyID: userData.id };
          const update = {
            lastSpotifyToken: access_token,
            userName: userData.display_name,
            refreshToken: refresh_token,
          };
          User.findOneAndUpdate(filter, update, {
            new: true,
            upsert: true,
          });

          User.findOne(
            { spotifyID: userData.id },
            { recentlyPlayed: { $slice: [0, 1] } },
            (err, user) => {
              if (!user.recentlyPlayed.length) {
                request.get(
                  recentlyPlayedOptions,
                  async (error, response, body) => {
                    if (!error) {
                      body.items.forEach((item) => {
                        delete item.track.available_markets;
                        delete item.track.album.available_markets;
                      });
                      const filter = { spotifyID: userData.id };
                      const update = {
                        recentlyPlayed: body.items,
                      };
                      await User.updateOne(filter, update);
                    }
                  }
                );
              }
            }
          );
          User.findOne({ spotifyID: userData.id }, { _id: 1 }, (err, user) => {
            res.redirect(
              `${uri}?access_token=${access_token}&refresh_token=${refresh_token}&id=${user._id}`
            );
          });
        }
      });
    });
  },
};

module.exports = auth;
