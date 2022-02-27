<template>
  <track-rows>
    <track-row
      v-for="(item, index) in moreTracks"
      :key="index"
      :track="item"
      :plays-or-date="false"
    />
  </track-rows>
</template>

<script setup>
import { getMoreTracks } from "@/api";

const props = defineProps({
  trackId: {
    type: String,
    required: true,
  },
});

const moreTracks = await getMoreTracks(props.trackId);
</script>
