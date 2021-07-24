import User from "../../models/User.js";

export default async function(fastify) {
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
    },
    async function(req, reply) {
      const _id = await fastify.auth(req);
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

      // get requestor's info
      const requestor = users.find((user) => user._id == _id);

      if (!requestor)
        return reply.code(404).send({ message: "User not found" });

      // filter away requestor
      users = users.filter((user) => user._id != _id);

      const route =
        "me/following/contains?type=user&ids=" +
        users.map((user) => user.spotifyID).join();

      // check if requestor follows users
      const followedList = await fastify.spotifyAPI({
        route,
        token: requestor.lastSpotifyToken,
      });
      const followed = users.filter((user, key) => followedList[key]);

      if (!followed.length) return reply.send({ status: 204, friends: [] });

      // check if users follow requestor
      const mutualFollowedList = (
        await Promise.all(
          followed.map((user) =>
            fastify.spotifyAPI({
              route: `me/following/contains?type=user&ids=${requestor.spotifyID}`,
              token: user.lastSpotifyToken,
            })
          )
        )
      ).flat(1);

      const friends = followed.filter((user, key) => mutualFollowedList[key]);

      if (!friends.length) return reply.send({ status: 204, friends: [] });

      reply.send({ friends });
    }
  );
}
