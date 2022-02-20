import User from "#server/models/User.js";

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
              username: { type: "string" },
              id: { type: "string" },
              display_name: { type: "string" },
              autoUpdate: { type: "boolean" },
              status: { type: "number" },
            },
          },
        },
        tags: ["settings"],
      },
    },
    async function (req, reply) {
      const id = req.session.get("id");

      const user = await User.findById(id, "display_name settings").lean();
      if (!user) throw fastify.error("User not found", 404);

      user.id = id;
      reply.send(Object.assign(user, user.settings));
    }
  );
}
