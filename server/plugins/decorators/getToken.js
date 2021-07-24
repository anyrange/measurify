import fp from "fastify-plugin";
import User from "../../models/User.js";

const plugin = fp(async function plugin(fastify) {
  fastify.decorate("getToken", async (_id) => {
    const user = await User.findById(_id, { lastSpotifyToken: 1 });

    if (!user) throw new fastify.CustomError("User not found", 404);

    return user.lastSpotifyToken;
  });
});

export default plugin;
