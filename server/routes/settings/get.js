import User from "../../models/User.js";

export default async function (fastify) {
  fastify.get(
    "",
    {
      schema: {
        response: {
          200: {
            type: "object",
            properties: {
              privacy: { type: "string" },
              customID: { type: "string" },
              spotifyID: { type: "string" },
              autoUpdate: { type: "boolean" },
              status: { type: "number" },
            },
          },
        },
        tags: ["user settings"],
      },
    },
    async function (req, reply) {
      const { _id } = req;
      const user = await User.findById(
        _id,
        "privacy customID spotifyID autoUpdate -_id"
      ).lean();

      if (!user) throw new this.CustomError("User not found", 404);

      reply.send(user);
    }
  );
}
