import fp from "fastify-plugin";
import api from "../../includes/api.js";
const plugin = fp(async function plugin(fastify) {
  fastify.decorate("spotifyAPI", api);
});

export default plugin;
