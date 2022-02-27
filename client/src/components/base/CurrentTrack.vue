<template>
  <track-row
    v-if="currentTrack"
    :track="currentTrack"
    current
    plays-or-date="date"
  >
    <template #current-track>
      <figure class="flex flex-row gap-1 items-center justify-end" title="now">
        <img :src="nowPlaying" alt="Listening Now" />
        <figcaption>Listening now</figcaption>
      </figure>
    </template>
  </track-row>
</template>

<script setup>
import { ref } from "vue";
import { getProfileCurrentTrack } from "@/api";
import nowPlaying from "@/assets/media/now_playing.gif";

const props = defineProps({
  username: {
    type: String,
    required: true,
  },
});

const currentTrack = ref(null);

currentTrack.value = await getProfileCurrentTrack({ username: props.username });
</script>
