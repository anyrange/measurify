<template>
  <div class="grid grid-cols-2 grid-rows-4 gap-2 lg:grid-cols-4 lg:grid-rows-2">
    <audio-feature
      v-for="(feature, index) in formatedFeatures"
      :key="index"
      :name="FEATURE_NAMES[feature[0]]"
      :score="feature[1] * 100"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
import AudioFeature from "./AudioFeature.vue";
import { FEATURE_NAMES } from "@/config";

const props = defineProps({
  audioFeatures: {
    type: Object,
    required: true,
  },
});

const formatedFeatures = computed(() => {
  const regex = new RegExp("^(key|tempo|loudness|mode)$", "g");
  const features = Object.entries(props.audioFeatures);
  return features.filter((feature) => feature[0].search(regex) === -1);
});
</script>
