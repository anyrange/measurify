import fetch from "node-fetch";
import User from "../models/User.js";
import formatTrack from "../utils/format-track.js";
import mongodb from "mongodb";
const { ObjectId } = mongodb;
import timeDiff from "../utils/timeDiff.js";

async function refresh_recently_played() {
  try {
    const start = new Date();

    const users = await User.find(
      { refreshToken: { $ne: "" } },
      {
        spotifyID: 1,
        lastSpotifyToken: 1,
        recentlyPlayed: { $slice: ["$recentlyPlayed", 1] },
        userName: 1,
      }
    );

    const requests = users.map((user) =>
      parseNewTracks(user)
        .then(async (newTracks) => {
          for (let i = 0; i < newTracks.length; i++) {
            await addTrack(user._id, newTracks[i]);
          }
        })
        .catch((err) => {
          console.log(
            `!listening-histories [${user.userName}]: ${err.message}`
          );
        })
    );

    Promise.all(requests).then(() => {
      const end = new Date();
      console.log(
        `listening-histories [${requests.length}]: updated in ${timeDiff(
          start,
          end
        )} sec`
      );
    });
  } catch (err) {
    console.error("!listening-histories [all]:" + err.message);
  }
}

async function parseNewTracks(user) {
  const newSongs = [];

  const listenedTracks = await fetch(
    "https://api.spotify.com/v1/me/player/recently-played?limit=15",
    { headers: { Authorization: "Bearer " + user.lastSpotifyToken } }
  ).then((res) => res.json());

  if (listenedTracks.error) throw new Error(listenedTracks.error.message);
  if (!listenedTracks.items.length) return newSongs;

  if (!user.recentlyPlayed || !user.recentlyPlayed.length)
    return listenedTracks.items.map((item) => formatTrack(item)).reverse();

  const lastListenedTrack = await User.aggregate([
    { $match: { _id: ObjectId(user._id) } },
    { $project: { recentlyPlayed: 1 } },
    { $unwind: { path: "$recentlyPlayed" } },
    { $unwind: { path: "$recentlyPlayed.plays" } },
    { $sort: { "recentlyPlayed.plays.played_at": -1 } },
    { $limit: 1 },
  ]);

  let i = 0;
  const lastPlayedAt = lastListenedTrack[0].recentlyPlayed.plays.played_at;

  while (
    i < listenedTracks.items.length &&
    Date.parse(lastPlayedAt) < Date.parse(listenedTracks.items[i].played_at)
  ) {
    newSongs.unshift(formatTrack(listenedTracks.items[i]));
    i++;
  }
  return newSongs;
}

export async function addTrack(_id, track) {
  const existingTrack = await User.findOne(
    { _id, "recentlyPlayed.id": track.id },
    { "recentlyPlayed.$": 1 }
  );

  if (!existingTrack) {
    await User.updateOne(
      { _id },
      { $push: { recentlyPlayed: { $each: [track], $position: 0 } } }
    );
    return;
  }

  await User.updateOne(
    { _id, "recentlyPlayed.id": track.id },
    {
      $push: { "recentlyPlayed.$.plays": { $each: track.plays, $position: 0 } },
    }
  );
}

export default refresh_recently_played;
