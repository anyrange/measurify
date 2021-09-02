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
            listened: { $size: "$listeningHistory" },
          })
          .sort("-listened"),
      ]);

      const friendsOnly = top.filter(
        (user) => user.privacy === "friendsOnly" && user._id !== requestor._id
      );

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

      reply.send({ top });
    }
  );
}
