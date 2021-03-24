<template>
  <div class="container mx-auto">
    <h2 class="h-title">
      Overview
    </h2>
    <div v-if="loading" class="mt-8">
      <LoadingSpinner />
    </div>
    <div class="mt-8" v-else>
      <div class="mx-4 mt-4 md:flex mb-6">
        <div class="md:w-1/4 mb-6 md:mb-0">
          <label class="total-played-listened">
            Tracks Played
          </label>
          <label class="total-played-listened-number">
            {{ totalTracksPlayed }}
          </label>
        </div>
        <div class="md:w-1/2">
          <label class="total-played-listened">
            Minutes Listened
          </label>
          <label class="total-played-listened-number">
            {{ totalMinutesListened }}
          </label>
        </div>
      </div>
      <div class="w-4/5 fixed">
        <apexchart
          type="area"
          height="350"
          width="90%"
          :options="chartOptions"
          :series="overviewData"
        ></apexchart>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingSpinner from "@/components/LoadingSpinner";
import chartOptions from "@/mixins/chartOptions";
import axios from "axios";

export default {
  components: {
    LoadingSpinner,
  },

  mixins: [chartOptions],

  data() {
    return {
      loading: true,

      tracksPlayed: [],
      totalTracksPlayed: 0,

      minutesListened: [],
      totalMinutesListened: 0,

      overviewData: [
        {
          name: "Plays",
          data: [],
        },
      ],
    };
  },

  computed: {
    user() {
      return this.$store.getters.getUser;
    },
  },

  methods: {
    getTotalTracksPlayed() {
      this.totalTracksPlayed = this.tracksPlayed.reduce(function(a, b) {
        return a + b;
      }, 0);
    },
    getTotalMinutesListened() {
      this.totalMinutesListened = this.minutesListened.reduce(function(a, b) {
        return a + b;
      }, 0);
    },
  },

  async created() {
    console.log(
      `${process.env.VUE_APP_SERVER_URI}/getOverview?spotifyID=${this.user.id}`
    );
    await axios
      .get(
        `${process.env.VUE_APP_SERVER_URI}/getOverview?spotifyID=${this.user.id}`
      )
      .then((response) => {
        for (const item of response.data) {
          this.overviewData[0].data.push(item.plays);
          this.chartOptions.xaxis.categories.push(item.date);

          this.minutesListened.push(item.duration);
          this.tracksPlayed.push(item.plays);

          this.getTotalTracksPlayed();
          this.getTotalMinutesListened();
        }
      })
      .catch((err) => console.log(err))
      .finally(() => (this.loading = false));
  },
};
</script>

<style>
.total-played-listened {
  @apply block text-2xl text-gray-600 dark:text-gray-100 font-light tracking-wide mb-2;
}
.total-played-listened-number {
  @apply block text-4xl text-gray-600 dark:text-gray-100 font-bold tracking-wide mb-2;
}
.apexcharts-zoomin-icon,
.apexcharts-zoomout-icon,
.apexcharts-zoom-icon.apexcharts-selected,
.apexcharts-pan-icon,
.apexcharts-menu-icon {
  display: none;
}
.apexcharts-tooltip.apexcharts-theme-light {
  background-color: #181818 !important;
  border: 1px solid #464846 !important;
  box-shadow: 0px 0px 0px 0px #fff !important;
  border-radius: 0px !important;
  color: #1cd460;
  padding: 4px !important;
  font-family: "Inter", sans-serif !important;
}
.apexcharts-tooltip-text {
  font-size: 14px !important;
}
.apexcharts-tooltip-text-value {
  font-weight: normal !important;
}
.apexcharts-tooltip-title {
  border: 0 !important;
  font-size: 16px !important;
  color: #fff;
  background-color: #181818 !important;
  margin-bottom: 0px !important;
}
.apexcharts-tooltip-y-group {
  padding: 0 !important;
}
.apexcharts-tooltip-marker {
  background-color: #1da14b !important;
}
</style>
