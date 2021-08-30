export default async function (fastify) {
  fastify.addHook("onSend", async (req, reply) => {
    if (reply.statusCode === 200)
      reply.header("Cache-Control", "public, max-age=30");
  });

  fastify.decorateRequest("user", null);
  fastify.addHook("preHandler", async (req, reply) => {
    const id = req.session.get("id") || "";
    const { username } = req.params;

    const requests = [
      fastify.db.User.findOne(
        { "settings.username": username },
        {
          display_name: 1,
          "settings.privacy": 1,
          "settings.username": 1,
          avatar: 1,
          lastLogin: 1,
          registrationDate: 1,
          tokens: 1,
        }
      ).lean(),
    ];

    if (id) requests.push(fastify.db.User.findById(id, "tokens.token").lean());
    const [user, requestor] = await Promise.all(requests);

    if (!user) throw fastify.error("User not found", 404);

    user.privacy = user.settings.privacy;
    user.username = user.settings.username;
    user.spotifyID = user._id;

    if (user.privacy === "private" && id != user._id)
      throw fastify.error("Private profile", 403);

    if (user.privacy === "friendsOnly" && id != user._id) {
      if (!requestor)
        throw fastify.error("Profile is open only for friends", 403);

      const friendProof = await Promise.all([
        fastify.spotifyAPI({
          route: `me/following/contains?type=user&ids=${id}`,
          token: user.tokens.token,
        }),
        fastify.spotifyAPI({
          route: `me/following/contains?type=user&ids=${user._id}`,
          token: requests.tokens.token,
        }),
      ]);

      if (!friendProof[0][0] || !friendProof[1][0])
        throw fastify.error("Profile is open only for friends", 403);
    }

    req.user = user;
  });
}
