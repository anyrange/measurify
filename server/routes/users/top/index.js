import User from "../../../models/User.js";
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

      const top = await User.aggregate()
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
        .sort("-listened");

      const friendsOnly = top.filter((user) => user.privacy === "friendsOnly");

      const visibility = (
        await Promise.all(
          friendsOnly.map((user) =>
            fastify.spotifyAPI({
              route: `me/following/contains?type=user&ids=${id}`,
              token: user.token,
            })
          )
        )
      ).flat(1);

      const notFriendList = friendsOnly.filter((user, key) => !visibility[key]);

      top.forEach((user) => {
        user.canSee = !notFriendList.find(
          (notFriend) => user._id === notFriend._id
        );
      });

      reply.send({ top });
    }
  );
}
