<template>
  <div class="container mx-auto">
    <h2 class="mt-12 mx-4 text-5xl font-semibold text-white">
      Overview
    </h2>
    <div v-if="loading" class="mt-8">
      <div
        class="fixed w-100 h-100 opacity-80 inset-0 z-50 flex items-center justify-center"
      >
        <svg
          class="animate-spin -ml-1 mr-3 h-12 w-12 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
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

      <apexchart
        type="area"
        height="350"
        :options="chartOptions"
        :series="series"
      ></apexchart>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import VueApexCharts from "vue3-apexcharts";

export default {
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      overviewData: [],
      durationMinutes: [],
      timePeriods: [],

      tacksPlayed: [],
      totalTracksPlayed: 0,

      minutesListened: [],
      totalMinutesListened: 0,

      loading: true,
      series: [
        {
          name: "duration",
          data: [],
        },
      ],
      chartOptions: {
        chart: {
          toolbar: {
            show: false,
          },
          height: 350,
          type: "area",
          animations: {
            enabled: false,
            easing: "easein",
            speed: 800,
            animateGradually: {
              enabled: true,
              delay: 50,
            },
            dynamicAnimation: {
              enabled: true,
              speed: 350,
            },
          },
        },
        stroke: {
          show: true,
          curve: "smooth",
          lineCap: "butt",
          colors: undefined,
          width: 2,
          dashArray: 0,
        },
        legend: {
          show: false,
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          type: "datetime",
          categories: [],
        },
        tooltip: {
          enabled: true,
          x: {
            show: false,
          },
          marker: {
            show: false,
          },
        },
        grid: {
          show: false,
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "dark",
            type: "vertical",
            shadeIntensity: 0.4,
            gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 0.1,
          },
        },
      },
    };
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    isActive() {
      return this.$route.name === "overview";
    },
  },
  async created() {
    await axios
      .get(
        `${process.env.VUE_APP_SERVER_URI}/getOverview?spotifyID=${this.user.id}`
      )
      .then((response) => {
        for (const item of response.data.plays) {
          this.series[0].data.push(item.duration);

          this.minutesListened.push(item.duration);
          this.tacksPlayed.push(item.plays);

          this.chartOptions.xaxis.categories.push(item.date);

          this.totalTracksPlayed = this.tacksPlayed.reduce(function(a, b) {
            return a + b;
          }, 0);
          this.totalMinutesListened = this.minutesListened.reduce(function(
            a,
            b
          ) {
            return a + b;
          },
          0);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => (this.loading = false));
  },
};
</script>

<style>
.total-played-listened {
  @apply block text-2xl text-gray-100  font-light tracking-wide mb-2;
}
.total-played-listened-number {
  @apply block text-4xl text-gray-100  font-bold tracking-wide mb-2;
}
</style>
