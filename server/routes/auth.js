const querystring = require("querystring");
const { URLSearchParams } = require("url");
const fetch = require("node-fetch");
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
    const _id = req.get("Authorization");
    User.findOne({ _id }, { lastSpotifyToken: 1 }, (err, user) => {
      if (err) {
        res.status(408).json({ message: err.toString() });
        return;
      }
      if (!user) {
        res.status(204).end();
        return;
      }
      res.status(200).end(user.lastSpotifyToken);
    });
  },
  callback: function(req, res) {
    let code = req.query.code || null;

    const params = new URLSearchParams();
    params.append("code", code);
    params.append("redirect_uri", redirect_uri);
    params.append("grant_type", "authorization_code");
    //get tokens
    fetch(`https://accounts.spotify.com/api/token`, {
      method: "POST",
      body: params,
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.SPOTIFY_CLIENT_ID +
              ":" +
              process.env.SPOTIFY_CLIENT_SECRET
          ).toString("base64"),
      },
    })
      .catch((err) => {
        res.status(400).json({ message: err.message });
      })
      .then(async (body) => {
        if (!body) {
          return;
        }
        body = await body.json();
        if (body.error) {
          res.status(400).json({ message: body });
          return;
        }

        const access_token = body.access_token;
        const refresh_token = body.refresh_token;

        const uri = process.env.FRONTEND_URI || "http://localhost:3000";

        //get user info
        fetch(`https://api.spotify.com/v1/me`, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + access_token,
          },
        })
          .catch((err) => {
            res.status(400).json({ message: err.message });
          })
          .then(async (body) => {
            if (!body) return;
            body = await body.json();
            if (body.error) {
              res
                .status(body.error.status)
                .json({ message: body.error.message });
              return;
            }
            console.log(body.display_name + " logined");

            const filter = { spotifyID: body.id };
            const update = {
              lastSpotifyToken: access_token,
              userName: body.display_name,
              refreshToken: refresh_token,
              image: body.images.length ? body.images[0].url : "",
              __v: 1,
            };

            await User.findOneAndUpdate(filter, update, {
              new: true,
              upsert: true,
            });

            // get recentlyPlayed if it is empty
            User.findOne(
              { spotifyID: body.id },
              { recentlyPlayed: { $slice: ["$recentlyPlayed", 1] } },
              (err, user) => {
                if (err) {
                  res.status(408).json({ message: err.toString() });
                  return;
                }
                if (!user) {
                  res.status(404).json({ message: "user not found " });
                  return;
                }
                if (user.recentlyPlayed && user.recentlyPlayed.length) {
                  res.redirect(
                    `${uri}?access_token=${access_token}&id=${user._id}`
                  );
                  return;
                }
                fetch(
                  `https://api.spotify.com/v1/me/player/recently-played?limit=50`,
                  {
                    method: "GET",
                    headers: {
                      Authorization: "Bearer " + access_token,
                    },
                  }
                )
                  .catch(() => {
                    return;
                  })
                  .then(async (body) => {
                    if (!body) return;
                    body = await body.json();
                    if (body.error || !body.items.length) {
                      res.redirect(
                        `${uri}?access_token=${access_token}&id=${user._id}`
                      );
                      return;
                    }

                    await body.items.forEach((item) => {
                      delete item.track.available_markets;
                      delete item.track.album.available_markets;
                    });

                    const query = { _id: user._id };
                    const update = {
                      recentlyPlayed: body.items,
                    };

                    await User.updateOne(query, update);

                    res.redirect(
                      `${uri}?access_token=${access_token}&id=${user._id}`
                    );
                  });
              }
            );
          });
      });
  },
};

module.exports = auth;
