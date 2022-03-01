<template>
  <container-item v-if="tracksList.length">
    <container-item-label>Album content</container-item-label>
    <track-rows>
      <track-row
        v-for="(item, index) in tracksList"
        :key="index"
        plays
        :track="{
          ...item,
          album: false,
        }"
      />
    </track-rows>
  </container-item>
</template>

<script setup>
import { computed } from "vue";
import { getAlbumContent } from "@/api";

const props = defineProps({
  albumId: {
    type: String,
    required: true,
  },
  favouriteTracks: {
    type: Array,
    required: true,
  },
});

const content = await getAlbumContent(props.albumId);

const tracksList = computed(() => {
  const combinedTracks = [...content, ...props.favouriteTracks];
  let formattedTracks = [
    ...new Map(combinedTracks.map((item) => [item["id"], item])).values(),
  ];
  formattedTracks.map((track) => {
    if (!track.plays) track.plays = 0;
  });
  formattedTracks.sort((a, b) => b.plays - a.plays);
  return formattedTracks;
});
</script>
