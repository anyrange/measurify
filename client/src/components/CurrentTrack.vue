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
import { getProfileCurrentTrack } from "@/api";
import nowPlaying from "@/assets/media/now_playing.gif";
import TrackRow from "@/components/TrackRow.vue";
import { ref } from "vue";
import { useProfileStore } from "@/stores/profile";

const profileStore = useProfileStore();

const currentTrack = ref(null);

(async () => {
  currentTrack.value = await getProfileCurrentTrack({
    username: profileStore.profile.user.username,
  });
})();
</script>
