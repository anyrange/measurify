import fetch from "node-fetch";
import User from "../models/User.js";
import formatTrack from "./format-track.js";
import dotenv from "dotenv";
import mongodb from "mongodb";
const { ObjectId } = mongodb;
dotenv.config();

function refresh_recently_played() {
  const start = new Date();

  User.find(
    { refreshToken: { $ne: "" } },
    {
      spotifyID: 1,
      lastSpotifyToken: 1,
      recentlyPlayed: {
        $slice: ["$recentlyPlayed", 1],
      },
      userName: 1,
    },
    (err, users) => {
      if (err) return console.log(err);

      let requests = users.map((user) => {
        return new Promise((resolve, reject) => {
          parseNewTracks(user, resolve, reject);
        })
          .then(async (newTracks) => {
            for (let i = 0; i < newTracks.length; i++) {
              await addTrack(user._id, newTracks[i]);
            }
          })
          .catch(({ user, message }) => {
            console.log(
              "listening-histories: " + user + " got an error - " + message
            );
          });
      });

      Promise.all(requests).then(() => {
        const end = new Date();
        console.log(
          `listening-histories [${requests.length}]: updated in ${(
            (end.getTime() - start.getTime()) /
            1000
          ).toFixed(2)} sec`
        );
      });
    }
  );
}

async function parseNewTracks(user, cb, reject) {
  try {
    const listenedTracks = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=15",
      {
        headers: {
          Authorization: "Bearer " + user.lastSpotifyToken,
        },
      }
    ).then((res) => res.json());

    if (listenedTracks.error) throw new Error(listenedTracks.error.message);
    if (!listenedTracks.items.length) return cb([]);

    if (!user.recentlyPlayed || !user.recentlyPlayed.length)
      cb(listenedTracks.items.map((item) => formatTrack(item)).reverse());

    let i = 0;
    let newSongs = [];

    const lastListenedTrack = await User.aggregate([
      {
        $match: {
          _id: ObjectId(user._id),
        },
      },
      {
        $project: {
          recentlyPlayed: 1,
        },
      },
      {
        $unwind: {
          path: "$recentlyPlayed",
        },
      },
      {
        $unwind: {
          path: "$recentlyPlayed.plays",
        },
      },
      {
        $sort: {
          "recentlyPlayed.plays.played_at": -1,
        },
      },
      {
        $limit: 1,
      },
    ]);

    while (
      i < listenedTracks.items.length &&
      Date.parse(lastListenedTrack[0].recentlyPlayed.plays.played_at) <
        Date.parse(listenedTracks.items[i].played_at)
    ) {
      newSongs.push(formatTrack(listenedTracks.items[i]));
      i++;
    }
    cb(newSongs.reverse());
  } catch (err) {
    reject({ user: user.userName, message: err.message });
  }
}

export async function addTrack(_id, track) {
  const existingTrack = await User.findOne(
    {
      _id,
      "recentlyPlayed.id": track.id,
    },
    { "recentlyPlayed.$": 1 }
  );

  if (!existingTrack) {
    const update = {
      $push: {
        recentlyPlayed: { $each: [track], $position: 0 },
      },
    };

    await User.updateOne({ _id }, update);
    return;
  }

  await User.updateOne(
    {
      _id,
      "recentlyPlayed.id": track.id,
    },
    {
      $push: { "recentlyPlayed.$.plays": { $each: track.plays, $position: 0 } },
    }
  );
}

export default refresh_recently_played;
