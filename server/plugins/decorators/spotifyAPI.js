import fp from "fastify-plugin";
import fetch from "node-fetch";

const plugin = fp(async function plugin(fastify) {
  fastify.decorate("spotifyAPI", async ({ route, token, query }) => {
    const options = token
      ? {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      : {};
    return await fetch(
      `https://api.spotify.com/v1/${route}${query ? `?${query}` : ""}`,
      options
    ).then((res) => res.json());
  });
});

export default plugin;
