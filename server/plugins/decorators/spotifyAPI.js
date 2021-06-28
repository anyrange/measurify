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
    const res = await fetch(
      `https://api.spotify.com/v1/${route}${query ? `?${query}` : ""}`,
      options
    );

    if (!res.ok) {
      console.log("Error:", res.statusText, res.status);
      throw new fastify.CustomError("Try later", 503);
    }

    const body = await res.json();
    if (body.error)
      throw new fastify.CustomError(res.error.message, res.error.status || 500);

    return body;
  });
});

export default plugin;
