import User from "../../../models/User.js";
import fetch from "node-fetch";
import { parseNewTracks } from "../../../includes/cron-workers/recently-played-parse.js";

export default async function (fastify) {
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
      const code = request.query.code || null;
      const { sw_redirect } = request.query;
      try {
        //get tokens
        const tokens = await fetchTokens(code, sw_redirect);

        if (tokens.error) throw new Error(tokens.error);

        const access_token = tokens.access_token;
        const refresh_token = tokens.refresh_token;

        //get user info
        const user = await fastify.spotifyAPI({
          route: "me",
          token: access_token,
        });

        const filter = { _id: user.id };
        const upsert = {
          tokens: {
            token: access_token,
            refreshToken: refresh_token,
          },
          country: user.country,
          avatar: user.images.length ? user.images[0].url : "",
          __v: 7,
        };
        const projection = {
          "tokens.token": 1,
          display_name: 1,
          listeningHistory: { $slice: ["$listeningHistory", 1] },
          "settings.username": 1,
        };

        const document = await User.findOneAndUpdate(filter, upsert, {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
          projection,
        });

        const requests = [];
        if (!document.settings.username)
          requests.push(
            User.updateOne(filter, {
              "settings.username": user.display_name,
              display_name: user.display_name,
            }).catch(async (e) => {
              if (e.code === 11000)
                await User.updateOne(filter, {
                  "settings.username": user.id,
                  display_name: user.display_name,
                });
            })
          );

        if (!document.listeningHistory || !document.listeningHistory.length)
          requests.push(parseNewTracks(document, 20));

        if (requests.length) await Promise.all(requests);

        request.session.set("id", String(document._id));

        reply.redirect(sw_redirect);
      } catch (err) {
        reply.redirect(sw_redirect);
      }
    }
  );
}

const fetchTokens = async (code, sw_redirect) => {
  const redirect_uri =
    process.env.REDIRECT_URI || "http://localhost:8888/auth/callback";
  const params = new URLSearchParams();
  params.append("code", code);
  params.append("redirect_uri", `${redirect_uri}?sw_redirect=${sw_redirect}`);
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
