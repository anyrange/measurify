export default async function (fastify) {
  fastify.get("", { schema: { tags: ["auth"] } }, (req, reply) => {
    const redirect_uri = `${process.env.VITE_SERVER_URI}/auth/callback`;
    const scopes = [
      "playlist-read-collaborative",
      "user-read-currently-playing",
      "user-read-recently-played",
      // "playlist-modify-private",
      // "playlist-modify-public",
      "playlist-read-private",
      "user-read-private",
      "user-library-read",
      "user-follow-read",
      // "ugc-image-upload",
      "user-read-email",
      "user-top-read",
    ];

    return reply.redirect(
      "https://accounts.spotify.com/authorize?" +
        `response_type=code` +
        `&client_id=${process.env.SPOTIFY_CLIENT_ID}` +
        `&scope=${scopes.join(" ")}` +
        `&redirect_uri=${redirect_uri}`
    );
  });
}
