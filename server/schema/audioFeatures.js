export default {
  $id: "audioFeatures",
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
    danceability: {
      type: "number",
    },
    energy: {
      type: "number",
    },
    key: {
      type: "number",
    },
    loudness: {
      type: "number",
    },
    mode: {
      type: "number",
    },
    speechiness: {
      type: "number",
    },
    acousticness: {
      type: "number",
    },
    instrumentalness: {
      type: "number",
    },
    liveness: {
      type: "number",
    },
    valence: {
      type: "number",
    },
    tempo: {
      type: "number",
    },
  },
};
