import User from "#server/models/User.js";
import fetch from "node-fetch";
import { getMonday } from "#server/utils/index.js";

export default async function (fastify) {
  fastify.get(
    "",
    {
      schema: {
        querystring: {
          type: "object",
          properties: { code: { type: "string" } },
        },
        tags: ["auth"],
      },
    },
    async (request, reply) => {
      const code = request.query.code || null;
      const sw_redirect = process.env.CLIENT_URI;
      try {
        //get tokens
        const tokens = await fetchTokens(code);

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
          "settings.username": 1,
          listeningHistory: { $slice: ["$listeningHistory", 1] },
          genresTimeline: { $slice: ["$genresTimeline", 1] },
        };

        const document = await User.findOneAndUpdate(filter, upsert, {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
          projection,
        });

        const requests = [];

        // update username if there is none
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

        // update listening history if there is none
        if (!document.listeningHistory || !document.listeningHistory.length) {
          const { parseNewTracks } = await import(
            "#server/includes/cron-workers/recentlyPlayed.js"
          );
          requests.push(parseNewTracks(document, 20));
        }

        // update genres timeline if there is none
        if (!document.genresTimeline || !document.genresTimeline.length) {
          const { getUserGenres } = await import(
            "#server/includes/cron-workers/genres.js"
          );

          requests.push(
            getUserGenres(access_token).then(async (genres) => {
              await User.updateOne(filter, {
                $push: {
                  genresTimeline: {
                    $each: [{ genres, date: getMonday() }],
                    $position: 0,
                  },
                },
              });
            })
          );
        }

        if (requests.length) await Promise.all(requests);

        request.session.set("id", String(document._id));

        reply.redirect(sw_redirect);
      } catch (err) {
        reply.redirect(sw_redirect);
      }
    }
  );
}

const fetchTokens = async (code) => {
  const redirect_uri = `${process.env.VITE_SERVER_URI}/auth/callback`;
  const params = new URLSearchParams();
  params.append("code", code);
  params.append("redirect_uri", `${redirect_uri}`);
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
