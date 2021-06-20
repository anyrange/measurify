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
            required: ["status", "token", "autoUpdate", "userName", "avatar"],
            properties: {
              status: {
                type: "number",
              },
              token: {
                type: "string",
              },
              avatar: {
                type: "string",
              },
              userName: {
                type: "string",
              },
              autoUpdate: {
                type: "boolean",
              },
            },
          },
        },
      },
    },
    async function(req, reply) {
      const _id = req.user_id;
      const { lastSpotifyToken: token, autoUpdate } = await User.findOne(
        { _id },
        { lastSpotifyToken: 1, autoUpdate: 1 }
      );

      const newData = await this.spotifyAPI({ route: "me", token });

      const userName = newData.display_name;
      const avatar = newData.images.length ? newData.images[0].url : "";
      const filter = { _id };
      const update = {
        userName,
        avatar,
        lastLogin: Date.now(),
      };

      reply
        .code(200)
        .send({ token, avatar, autoUpdate, userName, status: 200 });

      await User.updateOne(filter, update);
    }
  );
}
