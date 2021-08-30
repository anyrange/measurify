export default async function (fastify) {
  fastify.get(
    "",
    {
      schema: {
        response: {
          200: {
            type: "object",
            required: ["status", "friends"],
            properties: {
              status: { type: "number" },
              friends: { type: "array", items: fastify.getSchema("user") },
            },
          },
        },
        tags: ["pages"],
      },
      preValidation: [fastify.auth],
    },
    async function (req, reply) {
      const _id = req.session.get("id");

      let users = await fastify.db.User.find(
        {},
        "settings.username tokens.token display_name avatar lastLogin"
      ).lean();

      // get requestor's info
      const requestor = users.find((user) => user._id == _id);

      if (!requestor)
        return reply.code(404).send({ message: "User not found" });

      // filter away requestor
      users = users.filter((user) => user._id != _id);

      if (!users.length) return reply.send({ status: 204, friends: [] });

      const route =
        "me/following/contains?type=user&ids=" +
        users.map(({ _id }) => _id).join();

      // check if requestor follows users
      const followedList = await fastify.spotifyAPI({
        route,
        token: requestor.tokens.token,
      });

      const followed = users.filter((user, key) => followedList[key]);
      if (!followed.length) return reply.send({ status: 204, friends: [] });

      // check if users follow requestor
      const mutualFollowedList = (
        await Promise.all(
          followed.map((user) =>
            fastify.spotifyAPI({
              route: `me/following/contains?type=user&ids=${requestor._id}`,
              token: user.tokens.token,
            })
          )
        )
      ).flat(1);

      const friends = followed.filter((user, key) => mutualFollowedList[key]);
      if (!friends.length) return reply.send({ status: 204, friends: [] });

      reply.send({
        friends: friends.map((friend) => ({
          username: friend.settings.username,
          avatar: friend.avatar,
          display_name: friend.display_name,
          lastLogin: friend.lastLogin,
        })),
      });
    }
  );
}
