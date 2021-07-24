export default async function(fastify) {
  fastify.get(
    "",
    {
      schema: {
        querystring: {
          type: "object",
          required: ["sw_redirect"],
          properties: { sw_redirect: { type: "string" } },
        },
        tags: ["auth"],
      },
    },
    (request, reply) => {
      const redirect_uri =
        process.env.REDIRECT_URI || "http://localhost:8888/auth/callback";

      const query_uri = request.query.sw_redirect;
      const scopes = [
        "user-read-private",
        "user-read-email",
        "ugc-image-upload",
        "user-top-read",
        "playlist-modify-public",
        "user-read-recently-played",
        "playlist-modify-private",
        "user-follow-read",
        "playlist-read-private",
        "user-library-read",
        "playlist-read-collaborative",
      ];

      reply.redirect(
        "https://accounts.spotify.com/authorize?" +
          `response_type=code` +
          `&client_id=${process.env.SPOTIFY_CLIENT_ID}` +
          `&scope=${scopes.join(" ")}` +
          `&redirect_uri=${redirect_uri}?sw_redirect=${query_uri}`
      );
    }
  );
}
