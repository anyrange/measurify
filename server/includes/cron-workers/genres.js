import User from "#server/models/User.js";
import api from "#server/includes/api.js";
import forAllUsers from "#server/includes/forAllUsers.js";

const GENRES_LIMIT = 10;

export async function parseGenres() {
  await forAllUsers({ operation: "genres" }, refreshGenres);
}

async function refreshGenres({ tokens: { token }, display_name }) {
  const artists = await api({
    route: `me/top/artists?time_range=short_term&limit=50`,
    token,
  });

  if (!artists.items.length) return [];
  const genres = artists.items.map(({ genres }) => genres).flat(1);

  const res = genres.reduce((data, curr) => {
    data[curr] = data[curr] ? ++data[curr] : 1;
    return data;
  }, {});

  const genresTop = Object.entries(res).map(([val, numTimes]) => ({
    genre: val,
    times: numTimes,
  }));

  const formattedGenres = genresTop
    .sort((a, b) => b.times - a.times)
    .map(({ genre }) => genre)
    .slice(0, GENRES_LIMIT);

  await User.updateOne(
    { display_name },
    {
      $push: {
        genresTimeline: {
          $each: [{ genres: formattedGenres }],
          $position: 0,
        },
      },
    }
  );
}
