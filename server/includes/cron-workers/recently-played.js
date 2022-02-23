import User from "#server/models/User.js";
import api from "#server/includes/api.js";
import forAllUsers from "#server/includes/forAllUsers.js";

import {
  addArtists,
  addAlbums,
  // addTracks,
} from "#server/includes/cron-workers/historyParser/index.js";

export async function parseHistory() {
  await forAllUsers({ operation: "history" }, parseNewTracks);
}

export async function parseNewTracks(user, limit = 8) {
  const newSongs = [];

  const listenedTracks = await api({
    route: `me/player/recently-played?limit=${limit}`,
    token: user.tokens.token,
  });

  if (listenedTracks.error) throw new Error(listenedTracks.error.message);
  if (!listenedTracks.items.length) return;

  if (!user.listeningHistory || !user.listeningHistory.length) {
    newSongs.push(...listenedTracks.items.map((item) => formatTrack(item)));
  } else {
    const lastPlayedAt = user.listeningHistory[0].played_at;

    listenedTracks.items.forEach((item) => {
      if (Date.parse(lastPlayedAt.toISOString()) < Date.parse(item.played_at))
        newSongs.push(formatTrack(item));
    });
  }

  if (!newSongs.length) return;

  const artists = newSongs
    .map((song) => [...song.artists, ...song.album.artists])
    .flat(1);
  const albums = newSongs.map((song) => song.album.id);
  // const tracks = newSongs.map((song) => song.id);

  await Promise.all([
    addArtists(artists, user.tokens.token),
    addAlbums(albums, user.tokens.token),
    // addTracks(tracks, user.tokens.token),
    updateHistory(newSongs, user._id),
  ]);
}

const updateHistory = async (tracks, _id) => {
  await User.updateOne(
    { _id },
    {
      $inc: { overallListened: tracks.length },
      $push: {
        listeningHistory: {
          $each: tracks.map((track) => ({
            track: track.id,
            played_at: track.played_at,
          })),
          $position: 0,
        },
      },
    }
  );
};

const formatTrack = (item) => {
  if (!item || !item.track) return;

  const track = item.track;

  const formatedTrack = {
    album: {
      id: track.album.id,
      artists: track.album.artists.map(({ id }) => id),
    },
    artists: track.artists.map(({ id }) => id),
    id: track.id,
    played_at: item.played_at,
  };

  return formatedTrack;
};
