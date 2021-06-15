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
            required: ["status", "token"],
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
            },
          },
        },
      },
    },
    async function(req, reply) {
      const _id = req.user_id;
      const token = await this.getToken(_id);

      const user = await this.spotifyAPI({ route: "me", token });

      const userName = user.display_name;
      const avatar = user.images.length ? user.images[0].url : "";
      const filter = { _id };
      const update = {
        userName,
        avatar,
        lastLogin: Date.now(),
      };

      reply.code(200).send({ token, avatar, userName, status: 200 });

      await User.updateOne(filter, update);
    }
  );
}
