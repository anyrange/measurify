import fp from "fastify-plugin";

const plugin = fp(async function plugin(fastify) {
  fastify.decorate(
    "userGenres",
    async ({ token, range = 5, time_range = "medium_term" }) => {
      const artists = await fastify.spotifyAPI({
        route: `me/top/artists?time_range=${time_range}&limit=50`,
        token,
      });

      if (!artists.items.length) return [];
      const genres = artists.items.map(({ genres }) => genres).flat(1);

      let res = genres.reduce((data, curr) => {
        data[curr] = data[curr] ? ++data[curr] : 1;
        return data;
      }, {});

      const genresTop = [];

      Object.entries(res).forEach(([val, numTimes]) => {
        genresTop.push({ genre: val, times: numTimes });
      });

      return genresTop
        .sort((a, b) => b.times - a.times)
        .map(({ genre }) => genre)
        .slice(0, range);
    }
  );
});

export default plugin;
