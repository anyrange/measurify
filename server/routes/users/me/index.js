export default async function (fastify) {
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
              username: { type: "string" },
              display_name: { type: "string" },
              country: { type: "string" },
              autoUpdate: { type: "boolean" },
            },
          },
        },
        tags: ["users"],
      },
      preValidation: [fastify.auth],
    },
    async function (req, reply) {
      const id = req.session.get("id");

      const user = await fastify.db.User.findByIdAndUpdate(id, {
        lastLogin: Date.now(),
      })
        .select("tokens.token settings display_name country avatar")
        .lean();

      if (!user) throw fastify.error("User not found", 404);

      user.autoUpdate = user.settings.autoUpdate;
      user.username = user.settings.username;
      user.token = user.tokens.token;

      reply.send(user);
    }
  );
}
