<template>
  <loading-spinner v-if="loading" />
  <template v-else>
    <div class="mt-4">
      <div class="md:flex items-center">
        <img :src="track.image" class="w-56 h-56 mr-6 track-cover" />
        <div class="flex flex-col space-y-2 text-gray-500-spotify">
          <span class="text-5xl font-semibold mt-2 md:mt-0">
            {{ track.name }}
          </span>
          <span class="text-lg">
            By
            <a class="text-white">
              {{
                track.artists
                  .map(({ name }) => {
                    return name;
                  })
                  .join(", ")
              }}
            </a>
          </span>
          <span class="text-lg">
            From
            <a class="text-white">
              {{ track.album.name }}
            </a>
          </span>
          <span class="text-lg">
            {{ track.release_date }} - {{ trackDuration }}
          </span>
        </div>
      </div>
      <div class="grid gap-7 xl:grid-cols-4 lg:grid-cols-2 mb-2 mt-6">
        <card :value="totalTracksPlayed">
          Times Played
        </card>
        <card :value="totalMinutesListened">
          Minutes Listened
        </card>
      </div>
      <audio controls>
        <source :src="track.preview_url" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  </template>
</template>

<script>
import { getTrack } from "@/api";
import { addSeconds, format } from "date-fns";
import { mapGetters } from "vuex";
import Card from "@/components/Card";
import chartOptions from "@/mixins/chartOptions";

export default {
  components: {
    Card,
  },
  mixins: [chartOptions],
  data() {
    return {
      loading: true,
      selectedPeriod: "alltime",
      track: {},
      totalTracksPlayed: 0,
      totalMinutesListened: 0,
    };
  },
  computed: {
    ...mapGetters({
      user: "getUser",
    }),
    trackDuration() {
      return format(
        addSeconds(new Date(0), this.track.duration_ms / 1000),
        "mm:ss"
      );
    },
  },
  async created() {
    try {
      const response = await getTrack(this.$route.params.id);
      this.track = response.track;
      this.totalTracksPlayed = response.overview.plays;
      this.totalMinutesListened = response.overview.playtime;
      this.loading = false;
      document.title = `${this.track.name} - Spotiworm`;
    } catch (error) {
      this.$router.push({ name: "home" });
    }
  },
};
</script>
