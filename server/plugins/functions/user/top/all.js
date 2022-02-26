import fp from "fastify-plugin";
import { tracks } from "./tracks.js";
import { albums } from "./albums.js";
import { artists } from "./artists.js";

export default fp(async function plugin(fastify) {
  fastify.decorate("userTop", async (options) => {
    const res = await Promise.all([
      tracks(options),
      albums(options),
      artists(options),
    ]);

    return {
      tracks: res[0]?.tracks || [],
      albums: res[1][0]?.albums || [],
      artists: res[2][0]?.artists || [],
    };
  });
});
