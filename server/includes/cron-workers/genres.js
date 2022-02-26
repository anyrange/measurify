import User from "#server/models/User.js";
import api from "#server/includes/api.js";
import forAllUsers from "#server/includes/forAllUsers.js";

export async function parseGenres() {
  await forAllUsers({ operation: "genres" }, refreshGenres);
}

async function refreshGenres({ tokens: { token }, display_name }) {
  const genres = await getUserGenres(token);

  await User.updateOne(
    { display_name },
    {
      $push: {
        genresTimeline: {
          $each: [{ genres }],
          $position: 0,
        },
      },
    }
  );
}

export const getUserGenres = async (token) => {
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

  const GENRES_LIMIT = 10;

  const formattedGenres = genresTop
    .sort((a, b) => b.times - a.times)
    .map(({ genre }) => genre)
    .slice(0, GENRES_LIMIT);

  return formattedGenres;
};
