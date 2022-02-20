import User from "#server/models/User.js";
import api from "#server/includes/api.js";
import timeDiff from "#server/utils/timeDiff.js";

const GENRES_LIMIT = 10;

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

export default async function () {
  try {
    const start = new Date();

    const users = await User.find(
      { "tokens.refreshToken": { $ne: "" } },
      { _id: 0, "tokens.token": 1, display_name: 1 }
    );

    const requests = users.map((user) =>
      refreshGenres(user).catch((err) =>
        console.log(`!genres [${user.display_name}]: ${err.message}`)
      )
    );

    await Promise.all(requests);

    const end = new Date();
    console.log(
      `genres [${requests.length}]: updated in ${timeDiff(start, end)} sec`
    );
  } catch (err) {
    console.error("!genres [all]:" + err.message);
  }
}
