/**
 * @param {import('fastify').FastifyInstance} fastify
 */

import User from "../../models/User.js";
import fetch from "node-fetch";

export default async function(fastify) {
  const auth = fastify.getSchema("auth");

  fastify.get(
    "/",
    {
      schema: {
        headers: auth,
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              required: [
                "spotifyID",
                "lastSpotifyToken",
                "userName",
                "avatar",
                "customID",
              ],
              properties: {
                spotifyID: {
                  type: "string",
                },
                lastSpotifyToken: {
                  type: "string",
                },
                userName: {
                  type: "string",
                },
                avatar: {
                  type: "string",
                },
                customID: {
                  type: "string",
                },
              },
            },
          },
        },
      },
      attachValidation: true,
    },
    async function(req, reply) {
      try {
        if (req.validationError)
          return reply.code(401).send({ message: "Unauthorized" });

        const _id = req.headers.authorization;

        let users = await User.find(
          {},
          {
            customID: 1,
            spotifyID: 1,
            lastSpotifyToken: 1,
            userName: 1,
            avatar: 1,
          }
        );

        // get user's info
        const user = users.find((user) => user._id == _id);

        if (!user) return reply.code(404).send({ message: "User not found" });

        const access_token = user.lastSpotifyToken;

        // filter away user
        users = users.filter((user) => user._id != _id);

        const url =
          "https://api.spotify.com/v1/me/following/contains?type=user&ids=" +
          users.map((user) => user.spotifyID).join();

        // check if users are followed
        const friendList = await fetch(url, {
          headers: {
            Authorization: "Bearer " + access_token,
          },
        })
          .then((res) => res.json())
          .catch((err) => {
            throw err;
          });

        if (friendList.error)
          return reply.code(friendList.error.status || 500).send({
            message: friendList.error.message,
          });

        users = users.filter((user, key) => friendList[key]);

        if (!users.length) return reply.code(204).send({});

        reply.code(200).send(users);
      } catch (e) {
        reply.code(500).send({ message: "Something went wrong!" });
        console.log(e);
      }
    }
  );
}
