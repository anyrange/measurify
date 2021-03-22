<template>
  <div class="container mx-auto">
    <h2 class="mt-12 mx-4 text-5xl font-semibold text-white">
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
import LoadingSpinner from "@/components/LoadingSpinner";
import axios from "axios";

export default {
  components: {
    LoadingSpinner,
  },
  data() {
    return {
      durationMinutes: [],
      timePeriods: [],

      tacksPlayed: [],
      totalTracksPlayed: 0,

      minutesListened: [],
      totalMinutesListened: 0,

      loading: true,

      series: [
        {
          name: "Plays",
          data: [],
        },
      ],
      chartOptions: {
        chart: {
          stacked: false,
          type: "area",
          toolbar: {
            show: false,
          },
          animations: {
            enabled: false,
            easing: "linear",
            speed: 70,
            animateGradually: {
              enabled: true,
              delay: 0,
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
          colors: ["#1eb252"],
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
          colors: ["#1eb252"],
          gradient: {
            shade: "dark",
            type: "vertical",
            shadeIntensity: 0.4,
            gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
            opacityFrom: 1,
            opacityTo: 0.1,
          },
        },
        noData: {
          text: "Loading...",
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
    console.log(
      `${process.env.VUE_APP_SERVER_URI}/getOverview?spotifyID=${this.user.id}`
    );
    await axios
      .get(
        `${process.env.VUE_APP_SERVER_URI}/getOverview?spotifyID=${this.user.id}`
      )
      .then((response) => {
        for (const item of response.data.plays) {
          this.series[0].data.push(item.plays);

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
