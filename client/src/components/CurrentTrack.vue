<template>
  <track-row v-if="currentTrack" :track="currentTrack" current>
    <template #current-track>
      <div class="flex flex-row gap-1 items-center justify-end">
        <img src="/now_playing.gif" alt="Listening Now" />
        <span>Listening now</span>
      </div>
    </template>
  </track-row>
</template>

<script>
import { getProfileCurrentTrack } from "@/api";
import { mapState } from "vuex";
import TrackRow from "@/components/TrackRow";

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
  computed: {
    ...mapState({
      profile: (state) => state.profile.profile,
    }),
  },
  async mounted() {
    await this.getCurrentTrack();
    setInterval(async () => {
      await this.getCurrentTrack();
    }, 15000);
  },
  methods: {
    async getCurrentTrack() {
      const { track } = await getProfileCurrentTrack({
        username: this.profile.user.username,
      });
      this.currentTrack = track;
    },
  },
};
</script>