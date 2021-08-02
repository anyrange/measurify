import fp from "fastify-plugin";

const plugin = fp(async function plugin(fastify) {
  fastify.addSchema({
    $id: "audioFeatures",
    title: "audio features",
    type: "object",
    properties: {
      danceability: { type: "number" },
      energy: { type: "number" },
      popularity: { type: "number" },
      key: { type: "number" },
      loudness: { type: "number" },
      mode: { type: "number" },
      speechiness: { type: "number" },
      acousticness: { type: "number" },
      instrumentalness: { type: "number" },
      liveness: { type: "number" },
      valence: { type: "number" },
      tempo: { type: "number" },
    },
  });
});

export default plugin;
