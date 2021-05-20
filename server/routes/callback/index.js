/**
 * @param {import('fastify').FastifyInstance} fastify
 * @param {*} opts
 */

import formatTrack from "../../includes/format-track.js";
import User from "../../models/User.js";
import fetch from "node-fetch";

const redirect_uri =
  process.env.REDIRECT_URI || "http://localhost:8888/callback";

export default async function(fastify) {
  fastify.get("/", async (request, reply) => {
    try {
      const code = request.query.code || null;
      const query_uri = request.query.sw_redirect || process.env.FRONTEND_URI || "http://localhost:3000";

      //get tokens
      const tokens = await fetchTokens(code, query_uri);

      if (tokens.error) {
        return reply.code(500).send({
          message: tokens.error,
        });
      }

      const access_token = tokens.access_token;
      const refresh_token = tokens.refresh_token;

      //get user info
      const user = await fetch(`https://api.spotify.com/v1/me`, {
        headers: {
          Authorization: "Bearer " + access_token,
        },
      })
        .then((res) => res.json())
        .catch((err) => {
          throw err;
        });

      if (user.error)
        return reply.code(tokens.error.status || 500).send({
          message: tokens.error.message,
        });

      console.log(user.display_name + " logined");

      const filter = { spotifyID: user.id };
      const upsert = {
        lastSpotifyToken: access_token,
        userName: user.display_name,
        refreshToken: refresh_token,
        avatar: user.images.length ? user.images[0].url : "",
        __v: 3,
      };
      const projection = {
        recentlyPlayed: { $slice: ["$recentlyPlayed", 1] },
        spotifyID: 1,
        customID: 1,
      };

      const document = await User.findOneAndUpdate(filter, upsert, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        projection,
      });

      // check if recentlyPlayed  is empty
      if (!document.customID)
        await User.updateOne(filter, { customID: user.id });

      if (!document.recentlyPlayed || !document.recentlyPlayed.length)
        await fetchHistory(access_token, document._id);

      reply.redirect(
        `${query_uri}?access_token=${access_token}&id=${document._id}`
      );
    } catch (e) {
      reply.code(500).send({ message: "Something went wrong!" });
      console.log(e);
    }
  });
}

const fetchTokens = async (code, query_uri) => {
  console.log();
  const params = new URLSearchParams();
  params.append("code", code);
  params.append("redirect_uri", `${redirect_uri}?sw_redirect=${query_uri}`);
  params.append("grant_type", "authorization_code");

  return await fetch(`https://accounts.spotify.com/api/token`, {
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
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const fetchHistory = async (access_token, _id) => {
  const history = await fetch(
    `https://api.spotify.com/v1/me/player/recently-played?limit=50`,
    {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }
  )
    .then((res) => res.json())
    .catch((err) => {
      throw err;
    });

  if (history.error) return console.log(history.error);

  if (!history.items.length) return;

  const query = { _id };
  const update = {
    recentlyPlayed: history.items.map((item) => formatTrack(item)),
  };

  await User.updateOne(query, update);
};
