import User from "#server/models/User.js";
import api from "#server/includes/api.js";
import forAllUsers from "#server/includes/forAllUsers.js";

import {
  addArtists,
  addAlbums,
  addTracks,
} from "#server/includes/cron-workers/historyParser/index.js";

export async function parseHistory() {
  await forAllUsers({ operation: "history" }, parseNewTracks);
}

export async function parseNewTracks(user, limit = 8) {
  const newListened = [];

  const listenedTracks = await api({
    route: `me/player/recently-played?limit=${limit}`,
    token: user.tokens.token,
  });

  if (listenedTracks.error) throw new Error(listenedTracks.error.message);
  if (!listenedTracks.items.length) return;

  if (!user.listeningHistory || !user.listeningHistory.length) {
    newListened.push(...listenedTracks.items);
  } else {
    const lastPlayedAt = user.listeningHistory[0].played_at;

    listenedTracks.items.forEach((item) => {
      if (Date.parse(lastPlayedAt.toISOString()) < Date.parse(item.played_at))
        newListened.push(item);
    });
  }

  if (!newListened.length) return;

  const artistIds = newListened
    .map(({ track }) => [
      ...track.artists.map((artist) => artist.id),
      ...track.album.artists.map((artist) => artist.id),
    ])
    .flat(1);

  const albumIds = newListened.map(({ track }) => track.album.id);
  const tracks = newListened.map(({ track }) => track);

  await Promise.all([
    addArtists(artistIds, user.tokens.token),
    addAlbums(albumIds, user.tokens.token),
    addTracks(tracks, user.tokens.token),
    updateHistory(newListened, user._id),
  ]);
}

const updateHistory = async (newItems, _id) => {
  await User.updateOne(
    { _id },
    {
      $inc: {
        "overallListened.count": newItems.length,
        "overallListened.time":
          newItems.reduce((acc, curr) => acc + curr.track.duration_ms, 0) /
          1000,
      },

      $push: {
        listeningHistory: {
          $each: newItems.map((item) => ({
            track: item.track.id,
            played_at: item.played_at,
          })),
          $position: 0,
        },
      },
    }
  );
};
