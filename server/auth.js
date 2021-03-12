const querystring = require("querystring");
const request = require("request");
const User = require("./models/User");

let redirect_uri = process.env.REDIRECT_URI || "http://localhost:8888/callback";

const auth = {
  login: function(req, res) {
    res.redirect(
      "https://accounts.spotify.com/authorize?" +
        querystring.stringify({
          response_type: "code",
          client_id: process.env.SPOTIFY_CLIENT_ID,
          scope: "user-read-private user-read-email",
          redirect_uri,
        })
    );
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
          new Buffer(
            process.env.SPOTIFY_CLIENT_ID +
              ":" +
              process.env.SPOTIFY_CLIENT_SECRET
          ).toString("base64"),
      },
      json: true,
    };
    request.post(authOptions,  function(error, response, body) {
      const access_token = body.access_token;
      // const spotifyID = body.client_id;
      // console.log(spotifyID)
      let uri = process.env.FRONTEND_URI || "http://localhost:3000";

      const user = new User({
        spotifyToken: access_token,
        // spotifyID: spotifyID,
      });
      user.save(function(err) {
        if (err) return handleError(err);
      });

      res.redirect(uri + "?access_token=" + access_token);
    });
  },
};

module.exports = auth;
