const querystring = require("querystring");
const { URLSearchParams } = require("url");
const fetch = require("node-fetch");
const User = require("../models/User");
const formatTrack = require("../includes/formatTrack");

const redirect_uri =
  process.env.REDIRECT_URI || "http://localhost:8888/callback";

const uri = process.env.FRONTEND_URI || "http://localhost:3000";

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
  getAccessToken: async function(req, res) {
    try {
      const _id = req.get("Authorization");
      const response = await User.findOne({ _id }, { lastSpotifyToken: 1 });
      res.status(200).end(response.lastSpotifyToken);
      await User.updateOne({ _id }, { lastLogin: Date.now() });
    } catch (e) {
      res.status(404).json();
      console.log(e);
    }
  },
  callback: async function(req, res) {
    try {
      const code = req.query.code || null;

      //get tokens
      const tokens = await fetchTokens(code);

      const access_token = tokens.access_token;
      const refresh_token = tokens.refresh_token;

      //get user info
      const user = await fetch(`https://api.spotify.com/v1/me`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + access_token,
        },
      });
      const userJSON = await user.json();

      if (userJSON.error) throw new Error(JSON.stringify(userJSON.error));

      console.log(userJSON.display_name + " logined");

      const filter = { spotifyID: userJSON.id };
      const upsert = {
        lastSpotifyToken: access_token,
        userName: userJSON.display_name,
        refreshToken: refresh_token,
        avatar: userJSON.images.length ? userJSON.images[0].url : "",
        __v: 3,
      };

      const updateOperation = await User.updateOne(filter, upsert, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      });

      // check if recentlyPlayed  is empty
      const document = await User.findOne(
        { spotifyID: userJSON.id },
        { recentlyPlayed: { $slice: ["$recentlyPlayed", 1] }, spotifyID: 1 }
      );

      if (updateOperation.nModified === 0) {
        await User.updateOne(
          { _id: document._id },
          { customID: document.spotifyID }
        );
      }

      if (!document.recentlyPlayed || !document.recentlyPlayed.length) {
        await fetchHistory(access_token, document._id);
      }

      res.redirect(`${uri}?access_token=${access_token}&id=${document._id}`);
    } catch (e) {
      res.status(404).json();
      console.log(e);
    }
  },
};

const fetchTokens = async (code) => {
  const params = new URLSearchParams();
  params.append("code", code);
  params.append("redirect_uri", redirect_uri);
  params.append("grant_type", "authorization_code");

  const response = await fetch(`https://accounts.spotify.com/api/token`, {
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
  });

  if (!response) throw new Error("no spotify response");

  const body = await response.json();
  if (body.error) throw new Error(JSON.stringify(body.error));
  return body;
};

const fetchHistory = async (access_token, _id) => {
  const history = await fetch(
    `https://api.spotify.com/v1/me/player/recently-played?limit=50`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }
  );

  const historyJSON = await history.json();

  if (historyJSON.error || !historyJSON.items.length) {
    return;
  }

  const query = { _id };
  const update = {
    recentlyPlayed: historyJSON.items.map((item) => formatTrack(item)),
  };

  await User.updateOne(query, update);
};

module.exports = auth;
