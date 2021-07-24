import formatTrack from "../../../utils/format-track.js";
import User from "../../../models/User.js";
import fetch from "node-fetch";
import jwt from "jsonwebtoken";
import { addTrack } from "../../../includes/cron-workers/recently-played-parse.js";
import api from "../../../includes/api.js";

export default async function(fastify) {
  fastify.get(
    "",
    {
      schema: {
        querystring: {
          type: "object",
          required: ["sw_redirect"],
          properties: {
            sw_redirect: { type: "string" },
            code: { type: "string" },
          },
        },
        tags: ["auth"],
      },
    },
    async (request, reply) => {
      try {
        const code = request.query.code || null;
        const query_uri = request.query.sw_redirect;

        //get tokens
        const tokens = await fetchTokens(code, query_uri);

        if (tokens.error) throw new Error(tokens.error);

        const access_token = tokens.access_token;
        const refresh_token = tokens.refresh_token;

        //get user info
        const user = await api({ route: "me", token: access_token });

        console.log(user.display_name + " logined");

        const filter = { spotifyID: user.id };
        const upsert = {
          lastSpotifyToken: access_token,
          userName: user.display_name,
          country: user.country,
          refreshToken: refresh_token,
          avatar: user.images.length ? user.images[0].url : "",
          __v: 6,
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

        const secret = process.env.SECRET_JWT;
        const token = jwt.sign({ _id: document._id }, secret);

        reply.setCookie("token", token, fastify.cookieOptions);

        reply.redirect(query_uri);
      } catch (err) {
        console.log(err);
        reply.redirect(query_uri);
      }
    }
  );
}

const fetchTokens = async (code, query_uri) => {
  const redirect_uri =
    process.env.REDIRECT_URI || "http://localhost:8888/auth/callback";
  const params = new URLSearchParams();
  params.append("code", code);
  params.append("redirect_uri", `${redirect_uri}?sw_redirect=${query_uri}`);
  params.append("grant_type", "authorization_code");

  const res = await fetch(`https://accounts.spotify.com/api/token`, {
    method: "POST",
    body: params,
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64"),
    },
  });

  return res.json();
};

const fetchHistory = async (token, _id) => {
  const history = await api({
    route: `me/player/recently-played?limit=50`,
    token,
  });

  if (!history.items.length) return;

  for (let i = 0; i < history.items.length; i++) {
    const track = formatTrack(history.items[i]);
    await addTrack(_id, track);
  }
};
