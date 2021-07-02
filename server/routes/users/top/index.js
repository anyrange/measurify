import User from "../../../models/User.js";
export default async function(fastify) {
  fastify.get(
    "",
    {
      schema: {
        response: {
          200: {
            type: "object",
            required: ["status", "top"],
            properties: {
              status: { type: "number" },
              top: { type: "array", items: fastify.getSchema("user") },
            },
          },
        },
      },
    },
    async function(req, reply) {
      const _id = await fastify.auth(req);
      const requestor = await User.findOne({ _id }, { spotifyID: 1 });

      if (!requestor) throw new this.CustomError("User not found", 404);

      const agg = [
        { $match: { privacy: { $ne: "private" } } },
        {
          $project: {
            userName: 1,
            avatar: 1,
            customID: 1,
            lastSpotifyToken: 1,
            lastLogin: 1,
            privacy: 1,
            "recentlyPlayed.plays.played_at": 1,
            "recentlyPlayed.duration_ms": 1,
          },
        },
        { $unwind: { path: "$recentlyPlayed" } },
        {
          $project: {
            userName: 1,
            lastLogin: 1,
            avatar: 1,
            customID: 1,
            lastSpotifyToken: 1,
            privacy: 1,
            "recentlyPlayed.duration_ms": 1,
            "recentlyPlayed.plays": {
              $size: "$recentlyPlayed.plays",
            },
          },
        },
        {
          $group: {
            _id: {
              userName: "$userName",
              avatar: "$avatar",
              customID: "$customID",
              lastSpotifyToken: "$lastSpotifyToken",
              lastLogin: "$lastLogin",
              privacy: "$privacy",
            },
            listened: {
              $sum: {
                $multiply: [
                  "$recentlyPlayed.plays",
                  { $divide: ["$recentlyPlayed.duration_ms", 60000] },
                ],
              },
            },
          },
        },
        { $match: { listened: { $gt: 0 } } },
        { $sort: { listened: -1 } },
      ];

      const topRaw = await User.aggregate(agg);

      const friendsOnly = topRaw.filter(
        (user) => user._id.privacy === "friendsOnly"
      );

      const visibility = (
        await Promise.all(
          friendsOnly.map((user) =>
            fastify.spotifyAPI({
              route: `me/following/contains?type=user&ids=${requestor.spotifyID}`,
              token: user._id.lastSpotifyToken,
            })
          )
        )
      ).flat(1);

      const notFriendList = friendsOnly.filter((user, key) => !visibility[key]);

      const top = topRaw.map((user) => {
        return {
          avatar: user._id.avatar,
          customID: user._id.customID,
          canSee: notFriendList.find(
            (notFriend) => user._id.userName === notFriend._id.userName
          )
            ? false
            : true,
          userName: user._id.userName,
          lastLogin: user._id.lastLogin,
          listened: Math.round(user.listened),
        };
      });

      reply.send({ top, status: 200 });
    }
  );
}
