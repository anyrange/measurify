/**
 * @param {import('fastify').FastifyInstance} fastify
 * @param {*} opts
 */

import querystring from "querystring";

const redirect_uri =
  process.env.REDIRECT_URI || "http://localhost:8888/callback";

export default async function(fastify) {
  fastify.get(
    "/",
    {
      schema: {
        querystring: {
          type: "object",
          required: ["sw_redirect"],
          properties: { sw_redirect: { type: "string" } },
        },
      },
      attachValidation: true,
    },
    (request, reply) => {
      if (request.validationError)
        return reply.code(404).send({ message: "Invalid redirect uri" });

      const query_uri = request.query.sw_redirect;

      reply.redirect(
        "https://accounts.spotify.com/authorize?" +
          querystring.stringify({
            response_type: "code",
            client_id: process.env.SPOTIFY_CLIENT_ID,
            scope:
              "user-read-private user-read-email ugc-image-upload user-top-read playlist-modify-public user-read-recently-played playlist-modify-private user-follow-read playlist-read-private user-library-read playlist-read-collaborative",
            redirect_uri: `${redirect_uri}?sw_redirect=${query_uri}`,
          })
      );
    }
  );
}
