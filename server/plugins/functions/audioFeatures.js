import fp from "fastify-plugin";
import parseAudioFeatures from "#server/includes/parseAudioFeatures.js";

const plugin = fp(async (fastify) =>
  fastify.decorate("parseAudioFeatures", parseAudioFeatures)
);

export default plugin;
