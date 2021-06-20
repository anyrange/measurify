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
            required: [
              "privacy",
              "customID",
              "spotifyID",
              "autoUpdate",
              "status",
            ],
            properties: {
              privacy: { type: "string" },
              customID: { type: "string" },
              spotifyID: { type: "string" },
              autoUpdate: { type: "boolean" },
              status: {
                type: "number",
              },
            },
          },
        },
      },
    },
    async function(req, reply) {
      const _id = req.user_id;
      const user = await User.findOne(
        { _id },
        { privacy: 1, customID: 1, spotifyID: 1, autoUpdate: 1 }
      );

      if (!user) throw new this.CustomError("User not found", 404);

      reply.code(200).send({
        privacy: user.privacy,
        customID: user.customID,
        spotifyID: user.spotifyID,
        autoUpdate: user.autoUpdate,
        status: 200,
      });
    }
  );
}
