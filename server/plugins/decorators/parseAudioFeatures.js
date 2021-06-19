import fp from "fastify-plugin";

const plugin = fp(async function plugin(fastify) {
  fastify.decorate("parseAudioFeatures", async (tracks, token) => {
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
    const { audio_features } = await fastify.spotifyAPI({
      route: `audio-features?ids=${tracks.map(({ id }) => id).join(",")}`,
      token,
    });

    const itemsNum = audio_features.length;

    // average
    const audioFeatures = audio_features.reduce((sum, current) => {
      return {
        danceability: sum.danceability + current.danceability / itemsNum,
        energy: sum.energy + current.energy / itemsNum,
        speechiness: sum.speechiness + current.speechiness / itemsNum,
        loudness: sum.loudness + current.loudness / itemsNum,
        acousticness: sum.acousticness + current.acousticness / itemsNum,
        instrumentalness:
          sum.instrumentalness + current.instrumentalness / itemsNum,
        liveness: sum.liveness + current.liveness / itemsNum,
        valence: sum.valence + current.valence / itemsNum,
        tempo: sum.tempo + current.tempo / itemsNum,
      };
    }, base);

    // formatting
    return {
      danceability: audioFeatures.danceability.toFixed(3),
      energy: audioFeatures.energy.toFixed(3),
      speechiness: audioFeatures.speechiness.toFixed(3),
      loudness: audioFeatures.loudness.toFixed(3),
      acousticness: audioFeatures.acousticness.toFixed(3),
      instrumentalness: audioFeatures.instrumentalness.toFixed(3),
      liveness: audioFeatures.liveness.toFixed(3),
      valence: audioFeatures.valence.toFixed(3),
      tempo: audioFeatures.tempo.toFixed(3),
    };
  });
});

export default plugin;
