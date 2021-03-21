const querystring = require("querystring");
const request = require("request");
const User = require("../models/User");

/*
let redirect_uri =
  `${process.env.VUE_APP_SERVER_URI}/callback` ||
  "http://localhost:8888/callback";

*/
// Ломает клиент, т.к там уже используеится VUE_APP_SERVER_URI, а тут получается он не нужен, поэтому давай извиняйся, я думал я прод наебнул

let redirect_uri = process.env.REDIRECT_URI || "http://localhost:8888/callback";

const auth = {
  login: function(req, res) {
    res.redirect(
      "https://accounts.spotify.com/authorize?" +
        querystring.stringify({
          response_type: "code",
          client_id: process.env.SPOTIFY_CLIENT_ID,
          scope:
            "user-read-private user-read-email ugc-image-upload user-read-playback-state user-top-read playlist-modify-public user-read-recently-played user-modify-playback-state playlist-modify-private user-follow-modify user-read-currently-playing user-follow-read playlist-read-private user-library-read playlist-read-collaborative",
          redirect_uri,
        })
    );
  },
  getAccessToken: function(req, res) {
    let spotifyID = req.query.spotifyID;
    User.findOne({ spotifyID }, (err, user) => {
      if (err) {
        console.log(err);
        return;
      }
      res.end(user.lastSpotifyToken);
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
        uri: "https://api.spotify.com/v1/me/player/recently-played?limit=50",
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
          await User.findOneAndUpdate(filter, update, {
            new: true,
            upsert: true,
          });

          User.findOne(
            { spotifyID: userData.id },
            { _id: 0, recentlyPlayed: 1 },
            (err, user) => {
              if (!user.recentlyPlayed.length) {
                request.get(
                  recentlyPlayedOptions,
                  async (error, response, body) => {
                    if (!error) {
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
        }
      });

      res.redirect(
        `${uri}?access_token=${access_token}&refresh_token=${refresh_token}`
      );
    });
  },
};

module.exports = auth;
