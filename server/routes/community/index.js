import User from "../../models/User.js";
import fetch from "node-fetch";
import mongodb from "mongodb";
const { ObjectId } = mongodb;

export default async function (fastify) {
  fastify.get(
    "",
    {
      schema: {
        description: "do not work properly yet",
        querystring: {
          type: "object",
          properties: {
            page: { type: "number", minimum: 1 },
            range: { type: "number", minimum: 2 },
          },
        },
        response: {
          200: {
            type: "object",
            required: ["status", "activity"],
            properties: {
              status: { type: "number" },
              activity: {
                type: "array",
                items: {
                  type: "object",
                  required: ["userName", "avatar", "customID", "track", "type"],
                  properties: {
                    userName: { type: "string" },
                    avatar: { type: "string" },
                    customID: { type: "string" },
                    track: { $ref: "track#" },
                    type: { type: "string" },
                  },
                },
              },
            },
          },
        },
        tags: ["pages"],
      },
      preValidation: [fastify.auth],
    },
    async function (req, reply) {
      const { _id } = req;

      const range = req.query.range || 10;
      const page = req.query.page || 1;

      let users = await User.find(
        {},
        {
          customID: 1,
          spotifyID: 1,
          lastSpotifyToken: 1,
          userName: 1,
          avatar: 1,
          lastLogin: 1,
        }
      );

      // get user's info
      const user = users.find((user) => user._id == _id);

      if (!user) throw new this.CustonError("User not found", 404);

      const access_token = user.lastSpotifyToken;

      // filter away user
      users = users.filter((user) => user._id != _id);

      const route =
        "me/following/contains?type=user&ids=" +
        users.map((user) => user.spotifyID).join();

      // check if users are followed
      const friendList = await fastify.spotifyAPI({
        route,
        token: access_token,
      });

      if (friendList.error)
        throw new this.CustonError(
          friendList.error.message,
          friendList.error.status || 500
        );

      const friends = users.filter((user, key) => friendList[key]);

      if (!friends.length) return reply.send({ status: 204, activity: [] });

      const trackActivity = await getTrackActivity(friends, page, range);

      const firstDate =
        page - 1 === 0
          ? new Date().toISOString()
          : trackActivity[0].track.played_at;

      const lastDate = trackActivity[trackActivity.length - 1].track.played_at;
      const requests = friends.map((friend) => {
        {
          const options = { friend, firstDate, lastDate };
          return getLiked(options);
        }
      });

      const likeActivity = await Promise.all(requests);

      const activity = [...likeActivity.flat(1), ...trackActivity].sort(
        (a, b) =>
          a.track.played_at < b.track.played_at
            ? 1
            : a.track.played_at > b.track.played_at
            ? -1
            : 0
      );

      reply.send({ activity });
    }
  );
}

const getTrackActivity = async (friends, page, range) => {
  const agg = [
    {
      $match: {
        $or: friends.map((friend) => {
          return { _id: new ObjectId(friend._id) };
        }),
      },
    },
    {
      $project: {
        track: {
          $slice: [
            "$recentlyPlayed",
            Math.floor(page / friends.length) * range,
            range,
          ],
        },
        userName: 1,
        customID: 1,
        _id: 0,
        avatar: 1,
      },
    },
    {
      $project: {
        track: {
          id: 1,
          plays: {
            played_at: 1,
          },
          name: 1,
          artists: {
            id: 1,
            name: 1,
          },
        },
        userName: 1,
        customID: 1,
        lastSpotifyToken: 1,
        avatar: 1,
      },
    },
    { $unwind: { path: "$track" } },
    { $unwind: { path: "$track.plays" } },
    {
      $project: {
        track: {
          id: 1,
          played_at: "$track.plays.played_at",
          name: 1,
          artists: {
            id: 1,
            name: 1,
          },
        },
        userName: 1,
        customID: 1,
        lastSpotifyToken: 1,
        avatar: 1,
      },
    },
    { $sort: { "track.played_at": -1 } },
    {
      $skip:
        page - 1 - Math.floor(page / (friends.length + 1)) * friends.length,
    },
    { $limit: range },
    { $addFields: { type: "listened" } },
  ];
  return await User.aggregate(agg);
};

const getLiked = async ({ friend, firstDate, lastDate }) => {
  let likedTracks = await getLikedTracks(friend.lastSpotifyToken);

  if (!likedTracks.items.length) return [];

  const liked = [];
  while (likedTracks.items.length && likedTracks.next != null) {
    const likedTrack = likedTracks.items.shift();

    if (likedTrack.added_at < lastDate) break;

    if (!likedTracks.items.length)
      likedTracks = await getLikedTracks(
        friend.lastSpotifyToken,
        likedTracks.next
      );

    if (likedTrack.added_at > firstDate) continue;

    liked.push({
      userName: friend.userName,
      avatar: friend.avatar,
      customID: friend.customID,
      track: {
        id: likedTrack.track.id,
        name: likedTrack.track.name,
        played_at: likedTrack.added_at,
        artists: likedTrack.track.artists.map(({ name, id }) => {
          return { name, id };
        }),
      },
      type: "liked",
    });
  }
  return liked;
};

const getLikedTracks = async (
  token,
  url = "https://api.spotify.com/v1/me/tracks?limit=30"
) => {
  return await fetch(url, {
    headers: {
      Authorization: "Bearer " + token,
    },
  }).then((res) => res.json());
};
