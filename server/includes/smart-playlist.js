import User from "../models/User.js";
import fetch from "node-fetch";
import mongo from "mongodb";
const { ObjectId } = mongo;
import dotenv from "dotenv";
dotenv.config();

export async function update() {
  const start = new Date();
  const subscribers = await User.find(
    {
      $nor: [
        { "subscriptions.smartPlaylist": { $exists: false } },
        { "subscriptions.smartPlaylist": { $size: 0 } },
        { "subscriptions.smartPlaylist": { $size: 1 } },
      ],
    },
    { lastSpotifyToken: 1, "subscriptions.smartPlaylist": 1, userName: 1 }
  );

  await Promise.all(
    subscribers.map(
      ({ _id, lastSpotifyToken, subscriptions: { smartPlaylist }, userName }) =>
        parsePlaylists({
          _id: _id,
          lastSpotifyToken: lastSpotifyToken,
          playlists: smartPlaylist.playlists,
          id: smartPlaylist.id,
        }).catch((err) =>
          console.log(`${userName} got an error: ${err.message}`)
        )
    )
  );

  const end = new Date();
  console.log(
    `${subscribers.length} smart-playlist updated in ${(
      (end.getTime() - start.getTime()) /
      1000
    ).toFixed(2)} sec [${new Date().toLocaleString("en-US", {
      timeZone: "Asia/Almaty",
    })}]`
  );
}

export async function parsePlaylists({ _id, lastSpotifyToken, playlists, id }) {
  const responses = await Promise.all([
    ...playlists.map((playlistID) => parseSongs(lastSpotifyToken, playlistID)),
  ]);

  const songsSet = new Set(responses.flat(1));

  const songs = [...songsSet];

  const repeated = await parseSongs(lastSpotifyToken, id);
  const alreadyListened = await listenedFind(_id, songs);

  if (alreadyListened.length) repeated.push(...alreadyListened);

  // filters away repeated songs
  const toRemoveMap = repeated.reduce(
    (memo, item) => ({
      ...memo,
      [item]: true,
    }),
    {}
  );

  const newSongs = songs.filter((x) => !toRemoveMap[x]);

  if (!newSongs.length) return;

  const addedTracks = await fetch(
    `https://api.spotify.com/v1/playlists/${id}/tracks?uris=${newSongs
      .map((song) => `spotify:track:${song}`)
      .join(",")}`,
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + lastSpotifyToken,
      },
    }
  ).then((res) => res.json());

  if (addedTracks.error) throw new Error(addedTracks.error);
  if (!addedTracks.snapshot_id) throw new Error(addedTracks);
}

export async function clean() {
  const start = new Date();
  const subscribers = await User.find(
    {
      $nor: [
        { "subscriptions.smartPlaylist": { $exists: false } },
        { "subscriptions.smartPlaylist": { $size: 0 } },
        { "subscriptions.smartPlaylist": { $size: 1 } },
      ],
    },
    { lastSpotifyToken: 1, "subscriptions.smartPlaylist.id": 1, userName: 1 }
  );

  await Promise.all(
    subscribers.map(
      ({ _id, lastSpotifyToken, subscriptions: { smartPlaylist }, userName }) =>
        cleanPlaylist({
          _id: _id,
          lastSpotifyToken: lastSpotifyToken,
          id: smartPlaylist.id,
        }).catch((err) =>
          console.log(`${userName} got an error: ${err.message}`)
        )
    )
  );

  const end = new Date();
  console.log(
    `${subscribers.length} smart-playlist cleaned in ${(
      (end.getTime() - start.getTime()) /
      1000
    ).toFixed(2)} sec [${new Date().toLocaleString("en-US", {
      timeZone: "Asia/Almaty",
    })}]`
  );
}

const parseSongs = async (lastSpotifyToken, playlistID) => {
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistID}?fields=tracks(items(track(id)))`,
    {
      headers: {
        Authorization: "Bearer " + lastSpotifyToken,
      },
    }
  ).then((res) => res.json());

  if (response.error) return [];

  const songs = response.tracks.items.map((item) => item.track.id);
  return songs;
};

const cleanPlaylist = async ({ _id, lastSpotifyToken, id }) => {
  const songs = await parseSongs(lastSpotifyToken, id);

  const alreadyListened = await listenedFind(_id, songs);
  if (!alreadyListened.length) return;

  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${id}/tracks`,
    {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + lastSpotifyToken,
      },
      body: JSON.stringify({
        tracks: alreadyListened.map((track) => {
          return { uri: `spotify:track:${track}` };
        }),
      }),
    }
  ).then((res) => res.json());

  if (response.error) throw new Error(response.error.message);
  if (!response.snapshot_id) throw new Error("Error");
};

const listenedFind = async (_id, songs) => {
  const agg = [
    {
      $match: {
        _id: new ObjectId(_id),
      },
    },
    {
      $project: {
        "recentlyPlayed.id": 1,
      },
    },
    {
      $unwind: {
        path: "$recentlyPlayed",
      },
    },
    {
      $match: {
        "recentlyPlayed.id": {
          $in: songs,
        },
      },
    },
    {
      $group: {
        _id: {},
        tracks: {
          $push: "$recentlyPlayed.id",
        },
      },
    },
  ];
  const res = await User.aggregate(agg);
  return res[0]?.tracks || [];
};
