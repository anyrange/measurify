<template>
  <div class="grid lg:grid-cols-4 lg:grid-rows-2 grid-cols-2 grid-rows-4 gap-2">
    <audio-feature
      v-for="(feature, index) in formatedFeatures"
      :key="index"
      :name="$options.FEATURE_NAMES[feature[0]]"
      :score="feature[1] * 100"
    />
  </div>
</template>

<script>
import AudioFeature from "@/components/AudioFeature.vue";

export default {
  name: "AudioFeatures",
  components: {
    AudioFeature,
  },
  props: {
    audioFeatures: {
      type: Object,
      required: true,
    },
  },
  FEATURE_NAMES: {
    danceability: "Danceable",
    popularity: "Popularity",
    acousticness: "Acoustic",
    liveness: "Lively",
    energy: "Energetic",
    speechiness: "Speechful",
    instrumentalness: "Instrumental",
    valence: "Valence",
  },
  computed: {
    formatedFeatures() {
      const regex = new RegExp("^(key|tempo|loudness|mode)$", "g");
      const features = Object.entries(this.audioFeatures);
      return features.filter((feature) => feature[0].search(regex) === -1);
    },
  },
};
</script>
