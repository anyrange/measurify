export default async function (fastify) {
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
              top: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    username: { type: "string" },
                    avatar: { type: "string" },
                    display_name: { type: "string" },
                    canSee: { type: "boolean" },
                    lastLogin: { type: "string", format: "datetime" },
                    listened: { type: "number" },
                  },
                },
              },
            },
          },
        },
        tags: ["users"],
      },
      preValidation: [fastify.auth],
    },
    async function (req, reply) {
      const id = req.session.get("id");

      const [requestor, top] = await Promise.all([
        fastify.db.User.findById(id, "tokens.token"),
        fastify.db.User.aggregate()
          .match({
            "settings.privacy": { $ne: "private" },
            listeningHistory: { $ne: [] },
          })
          .project({
            display_name: 1,
            avatar: 1,
            username: "$settings.username",
            token: "$tokens.token",
            lastLogin: 1,
            privacy: "$settings.privacy",
            listeningHistory: 1,
          })
          .unwind("$listeningHistory")
          .lookup({
            from: "tracks",
            localField: "listeningHistory.track",
            foreignField: "_id",
            as: "listeningHistory",
          })
          .group({
            _id: {
              _id: "$_id",
              username: "$username",
              display_name: "$display_name",
              avatar: "$avatar",
              token: "$token",
              privacy: "$privacy",
              lastLogin: "$lastLogin",
            },
            plays: { $sum: 1 },
            listened: {
              $sum: { $first: "$listeningHistory.duration_ms" },
            },
          })
          .project({
            _id: "$_id._id",
            display_name: "$_id.display_name",
            avatar: "$_id.avatar",
            username: "$_id.username",
            token: "$_id.token",
            lastLogin: "$_id.lastLogin",
            privacy: "$_id.privacy",
            listened: { $round: { $divide: ["$listened", 60000] } },
          })
          .sort("-listened"),
      ]);

      const friendsOnly = top.filter(
        (user) => user.privacy === "friendsOnly" && user._id !== requestor._id
      );

      if (friendsOnly.length) {
        const [followedList, ...mutualFollowedList] = await Promise.all([
          fastify.spotifyAPI({
            route: `me/following/contains?type=user&ids=${friendsOnly
              .map(({ _id }) => _id)
              .join()}`,
            token: requestor.tokens.token,
          }),
          ...friendsOnly.map((user) =>
            fastify.spotifyAPI({
              route: `me/following/contains?type=user&ids=${requestor._id}`,
              token: user.token,
            })
          ),
        ]);

        const notFriends = friendsOnly.filter(
          (user, key) => !mutualFollowedList[key][0] || !followedList[key]
        );

        top.forEach((user) => {
          user.canSee = !notFriends.find(
            (notFriend) => user._id === notFriend._id
          );
        });
      } else {
        top.forEach((user) => {
          user.canSee = true;
        });
      }

      reply.send({ top });
    }
  );
}
