import User from "../../../models/User.js";

export default async function(fastify) {
  fastify.get(
    "",
    {
      schema: {
        response: {
          200: {
            type: "object",
            properties: {
              status: { type: "number" },
              token: { type: "string" },
              avatar: { type: "string" },
              userName: { type: "string" },
              country: { type: "string" },
              autoUpdate: { type: "boolean" },
            },
          },
        },
        tags: ["users"],
      },
    },
    async function(req, reply) {
      const _id = await fastify.auth(req);
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

      reply.send({
        token,
        avatar,
        autoUpdate,
        userName,
        country: newData.country,
      });

      await User.updateOne(filter, update);
    }
  );
}
