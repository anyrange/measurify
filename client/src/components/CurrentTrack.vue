<template>
  <track-row
    v-if="currentTrack"
    :track="currentTrack"
    current
    plays-or-date="date"
  >
    <template #current-track>
      <div class="flex flex-row gap-1 items-center justify-end" title="now">
        <img :src="$options.nowPlaingGif" alt="Listening Now" />
        <span>Listening now</span>
      </div>
    </template>
  </track-row>
</template>

<script>
import { getProfileCurrentTrack } from "@/api";
import { mapState } from "vuex";
import TrackRow from "@/components/TrackRow.vue";
import nowPlaingGif from "@/assets/now_playing.gif";

export default {
  name: "CurrentTrack",
  components: {
    TrackRow,
  },
  data() {
    return {
      currentTrack: null,
    };
  },
  nowPlaingGif,
  computed: {
    ...mapState({
      profile: (state) => state.profile.profile,
    }),
  },
  async created() {
    this.currentTrack = await getProfileCurrentTrack({
      username: this.profile.user.username,
    });
  },
};
</script>
