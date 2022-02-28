import fp from "fastify-plugin";
import { tracks } from "./tracks.js";
import { albums } from "./albums.js";
import { artists } from "./artists.js";

export default fp(async function plugin(fastify) {
  fastify.decorate("userTop", async (options) => {
    const [t, al, art] = await Promise.all([
      tracks(options),
      albums(options),
      artists(options),
    ]);

    t.tracks.forEach((item) => {
      if (!item.album.id) {
        item.album = al?.albums?.find(
          (album) => album.id === item.tracks[0].album
        );
      }
    });

    return {
      tracks: t.tracks,
      albums: al.albums,
      artists: art.artists,
    };
  });
});
