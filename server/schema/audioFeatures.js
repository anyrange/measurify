import fp from "fastify-plugin";

const plugin = fp(async function plugin(fastify) {
  fastify.addSchema({
    $id: "audioFeatures",
    title: "audio features",
    type: "object",
    required: [
      "danceability",
      "energy",
      "loudness",
      "speechiness",
      "acousticness",
      "instrumentalness",
      "liveness",
      "valence",
      "tempo",
    ],
    properties: {
      danceability: { type: "number" },
      energy: { type: "number" },
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
