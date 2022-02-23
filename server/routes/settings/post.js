import User from "#server/models/User.js";

export default async function (fastify) {
  fastify.post(
    "",
    {
      schema: {
        body: {
          type: "object",
          required: ["privacy", "username", "display_name"],
          properties: {
            privacy: {
              type: "string",
              pattern: "^(public|private|friendsOnly)$",
            },
            username: {
              type: "string",
              maxLength: 20,
              minLength: 1,
              pattern:
                "^(?!.*(?:overview|listening-history|about|profile|top-listeners|account|track))[a-z0-9_-]{3,16}$",
            },
            display_name: { type: "string", minLength: 1, maxLength: 30 },
          },
        },
        response: {
          X0X: {
            type: "object",
            required: ["message", "status"],
            properties: {
              message: { type: "string" },
              status: { type: "number" },
            },
          },
        },
        tags: ["settings"],
      },
    },
    async function (req, reply) {
      const _id = req.session.get("id");

      const { privacy, username, display_name } = req.body;

      const user = await User.findOne(
        { "settings.username": username },
        "_id"
      ).lean();

      if (user && user._id !== _id)
        throw this.error("This username is already taken", 403);

      const updateResult = await User.updateOne(
        { _id },
        { settings: { privacy, username }, display_name }
      );

      if (updateResult.n === 0) throw this.error("User not found", 404);

      if (updateResult.nModified === 0)
        throw this.error("Nothing to update", 400);

      reply.send({ message: "Successfully updated" });
    }
  );
}
