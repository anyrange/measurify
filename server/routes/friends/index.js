import User from "../../models/User.js";

export default async function(fastify) {
  const headers = fastify.getSchema("cookie");

  fastify.get(
    "",
    {
      schema: {
        headers,
        response: {
          200: {
            type: "object",
            required: ["status", "friends"],
            properties: {
              status: { type: "number" },
              friends: {
                type: "array",
                items: {
                  type: "object",
                  required: ["userName", "avatar", "customID", "lastLogin"],
                  properties: {
                    userName: {
                      type: "string",
                    },
                    avatar: {
                      type: "string",
                    },
                    customID: {
                      type: "string",
                    },
                    lastLogin: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    async function(request, reply) {
      const _id = request.user_id;
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

      if (!user)
        return reply.code(404).send({ message: "User not found", status: 404 });

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
        return reply.code(friendList.error.status || 500).send({
          message: friendList.error.message,
          status: friendList.error.status || 500,
        });

      const friends = users.filter((user, key) => friendList[key]);

      if (!friends.length)
        return reply.code(200).send({ status: 204, friends: [] });

      reply.code(200).send({ friends, status: 200 });
    }
  );
}
