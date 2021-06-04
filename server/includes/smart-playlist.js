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
    subscribers.map((subscriber) =>
      parsePlaylists(subscriber).catch((err) =>
        console.log(`${subscriber.userName} got an error: ${err.message}`)
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

const parsePlaylists = async ({
  _id,
  lastSpotifyToken,
  subscriptions: {
    smartPlaylist: { playlists, id },
  },
}) => {
  const responses = await Promise.all([
    ...playlists.map((playlistID) => parseSongs(lastSpotifyToken, playlistID)),
  ]);

  const songsSet = new Set(responses.flat(1));

  const songs = [...songsSet];

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

  const doubles = await parseSongs(lastSpotifyToken, id);
  const res = await User.aggregate(agg);

  if (res[0]?.tracks.length) doubles.push(...res[0].tracks);

  const toRemoveMap = doubles.reduce(
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
  if (addedTracks.snapshot) throw new Error(addedTracks);
};

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
