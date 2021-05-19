/**
 * @param {import('fastify').FastifyInstance} fastify
 * @param {*} opts
 */

import querystring from "querystring";

const redirect_uri =
  process.env.REDIRECT_URI || "http://localhost:8888/callback";

export default async function(fastify) {
  fastify.get("/", (request, reply) => {
    reply.redirect(
      "https://accounts.spotify.com/authorize?" +
        querystring.stringify({
          response_type: "code",
          client_id: process.env.SPOTIFY_CLIENT_ID,
          scope:
            "user-read-private user-read-email ugc-image-upload user-top-read playlist-modify-public user-read-recently-played playlist-modify-private user-follow-read playlist-read-private user-library-read playlist-read-collaborative",
          redirect_uri,
        })
    );
  });
}
