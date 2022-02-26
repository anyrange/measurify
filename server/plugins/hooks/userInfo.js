import fp from "fastify-plugin";

const plugin = fp(async function plugin(fastify) {
  fastify.decorateRequest("user", "");
  fastify.decorate("getUserInfo", async function (req) {
    const { username } = req.params;

    const user = await fastify.db.User.findOne(
      {
        "settings.username": username,
        "settings.privacy": { $ne: "private" },
      },
      { token: "$tokens.token", country: 1 }
    ).lean();

    if (!user) throw fastify.error("User not found", 404);

    req.user = user;
  });
});

export default plugin;
