import api from "#server/includes/api.js";

export default async (tracks, token) => {
  const base = {
    danceability: 0,
    energy: 0,
    speechiness: 0,
    loudness: 0,
    acousticness: 0,
    instrumentalness: 0,
    liveness: 0,
    valence: 0,
    tempo: 0,
  };

  if (!tracks.length) return base;

  // features of several tracks
  const { audio_features } = await api({
    route: `audio-features?ids=${tracks.slice(0, 99).join(",")}`,
    token,
  });

  // sum of features of several tracks
  audio_features.forEach((trackFeatures) => {
    Object.keys(base).forEach((key) => {
      base[key] += trackFeatures[key];
    });
  });

  const itemsNum = audio_features.length;

  // average
  Object.keys(base).forEach((key) => {
    base[key] = Number((base[key] / itemsNum).toFixed(3));
  });

  return base;
};
