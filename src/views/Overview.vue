<template>
  <div class="container mx-auto">
    <h2 class="h-title">
      Overview
    </h2>
    <template v-if="!emptyData">
      <template v-if="loading">
        <div class="mt-8">
          <LoadingSpinner />
        </div>
      </template>
      <template v-else>
        <div class="mt-8">
          <div class="sm:mx-4 mx-4">
            <ul class="tabs sm:flex">
              <li
                class="tab sm:rounded-l-lg sm:rounded-t-none rounded-t-lg"
                :class="[
                  selectedPeriod === 'alltime' ? 'is-active' : 'not-active',
                ]"
                @click="updateOverview('alltime')"
              >
                All Time
              </li>
              <li
                class="tab"
                :class="[
                  selectedPeriod === 'week' ? 'is-active' : 'not-active',
                ]"
                @click="updateOverview('week')"
              >
                This Week
              </li>
              <li
                class="tab sm:rounded-r-lg sm:rounded-b-none rounded-b-lg"
                :class="[
                  selectedPeriod === 'month' ? 'is-active' : 'not-active',
                ]"
                @click="updateOverview('month')"
              >
                This Month
              </li>
            </ul>
          </div>
          <div class="grid gap-7 xl:grid-cols-4 lg:grid-cols-2 mx-4 mb-2 mt-6">
            <Card
              :title="'Tracks Played'"
              :selected="selectedPeriod"
              :value="totalTracksPlayed"
              :previousValue="totalTracksPlayedPrev"
            />
            <Card
              :title="'Minutes Listened'"
              :selected="selectedPeriod"
              :value="totalMinutesListened"
              :previousValue="totalMinutesListenedPrev"
            />
          </div>
          <div class="w-full">
            <apexchart
              type="area"
              height="350"
              :options="chartOptions"
              :series="overviewData"
            ></apexchart>
          </div>
          <h2
            class="mx-4 mt-5 mb-8 text-4xl font-semibold dark:text-gray-100 text-gray-900"
          >
            Top Played
          </h2>
          <div class="mt-6 sm:mx-4 mx-4">
            <ul class="tabs sm:flex">
              <li
                class="tab sm:rounded-l-lg sm:rounded-t-none rounded-t-lg"
                :class="[
                  selectedTop === 'artists' ? 'is-active' : 'not-active',
                ]"
                @click="selectedTop = 'artists'"
              >
                Artists
              </li>
              <li
                class="tab"
                :class="[selectedTop === 'tracks' ? 'is-active' : 'not-active']"
                @click="selectedTop = 'tracks'"
              >
                Tracks
              </li>
              <li
                class="tab"
                :class="[selectedTop === 'albums' ? 'is-active' : 'not-active']"
                @click="selectedTop = 'albums'"
              >
                Albums
              </li>
              <li
                class="tab sm:rounded-r-lg sm:rounded-b-none rounded-b-lg"
                :class="[
                  selectedTop === 'playlists' ? 'is-active' : 'not-active',
                ]"
                @click="selectedTop = 'playlists'"
              >
                Playlists
              </li>
            </ul>
            <div class="mt-4">
              <div v-if="selectedTop === 'artists'">
                <Table :title="selectedTop" :data="totalTop.artists" />
              </div>
              <div v-if="selectedTop === 'tracks'">
                <Table :title="selectedTop" :data="totalTop.tracks" />
              </div>
              <div v-if="selectedTop === 'albums'">
                <Table :title="selectedTop" :data="totalTop.albums" />
              </div>
              <div v-if="selectedTop === 'playlists'">
                <Table :title="selectedTop" :data="totalTop.playlists" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </template>
    <template v-else>
      <div class="flex h-80 justify-center items-center">
        <div class="text-center">
          <h3 class="mx-4 mt-4 text-2xl font-semibold text-gray-200">
            No listening data
          </h3>
          <h3 class="mx-4 mt-1 text-base font-semibold text-gray-500">
            Start listening to music on Spotify and come back later!
          </h3>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import axios from "axios";
import Card from "@/components/Card";
import Table from "@/components/Table";
import chartOptions from "@/mixins/chartOptions";
import * as fd from "@/utils/dates";

export default {
  components: {
    Card,
    Table,
  },

  mixins: [chartOptions],

  data() {
    return {
      loading: true,
      emptyData: false,

      selectedPeriod: "alltime",
      selectedTop: "artists",

      newDates: [],
      newValues: [],

      totalOverview: [],
      totalTop: [],

      tracksPlayed: [],
      minutesListened: [],
      prevTracksPlayed: [],
      prevMinutesListened: [],

      week: [],
      month: [],
      prevWeek: [],
      prevMonth: [],
    };
  },

  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    totalTracksPlayed() {
      return this.tracksPlayed.reduce((a, b) => a + b, 0);
    },
    totalMinutesListened() {
      return this.minutesListened.reduce((a, b) => a + b, 0);
    },
    totalTracksPlayedPrev() {
      return this.prevTracksPlayed.reduce((a, b) => a + b, 0);
    },
    totalMinutesListenedPrev() {
      return this.prevMinutesListened.reduce((a, b) => a + b, 0);
    },
  },

  methods: {
    updateOverview(period) {
      this.selectedPeriod = period;
      if (period == "alltime") {
        this.updateChart(period);
      }
      if (period == "week") {
        this.updateChart(period);
      }
      if (period == "month") {
        this.updateChart(period);
      }
    },
    updateChart(period) {
      this.newDates = [];
      this.newValues = [];

      this.tracksPlayed = [];
      this.minutesListened = [];
      this.prevTracksPlayed = [];
      this.prevMinutesListened = [];

      if (period === "alltime") {
        this.updateTotals(this.totalOverview);
      }
      if (period === "week") {
        this.updateTotals(this.week, this.prevWeek);
      }
      if (period === "month") {
        this.updateTotals(this.month, this.prevMonth);
      }

      this.updateChartValues();
    },
    // updateTop(period) {},
    updateTotals(arr, prev) {
      for (const item of arr) {
        this.newDates.push(item.date);
        this.newValues.push(item.plays);
        this.tracksPlayed.push(item.plays);
        this.minutesListened.push(item.duration);
      }
      if (prev) {
        for (const item of prev) {
          this.prevTracksPlayed.push(item.plays);
          this.prevMinutesListened.push(item.duration);
        }
      }
    },
    updateChartValues() {
      this.chartOptions = {
        xaxis: {
          categories: this.newDates,
          labels: {
            formatter: function(value) {
              if (typeof value === "undefined") {
                return value;
              }
              const options = {
                month: "short",
                day: "numeric",
              };
              const date = new Date(value);
              return new Intl.DateTimeFormat("en-US", options).format(date);
            },
          },
        },
      };
      this.overviewData = [
        {
          data: this.newValues,
        },
      ];
    },
    pushToChart() {
      for (const item of this.totalOverview) {
        this.overviewData[0].data.push(item.plays);
        this.chartOptions.xaxis.categories.push(item.date);
        this.tracksPlayed.push(item.plays);
        this.minutesListened.push(item.duration);
      }
    },
    preCalculateFilteredArrays() {
      this.week = fd.getFilteredArray(
        this.totalOverview,
        fd.firstDayOfWeek,
        fd.lastDayOfWeek
      );
      this.month = fd.getFilteredArray(
        this.totalOverview,
        fd.firstDayOfMonth,
        fd.lastDayOfMonth
      );
      this.prevWeek = fd.getFilteredArray(
        this.totalOverview,
        fd.firstDayOfPreviousWeek,
        fd.lastDayOfPreviousWeek
      );
      this.prevMonth = fd.getFilteredArray(
        this.totalOverview,
        fd.firstDayOfPreviousMonth,
        fd.lastDayOfPreviousMonth
      );
    },
    fetchData() {
      const overview = `${process.env.VUE_APP_SERVER_URI}/overview`;
      const top = `${process.env.VUE_APP_SERVER_URI}/top`;

      const fetchedData = (url) =>
        axios.get(url, {
          headers: {
            Authorization: this.user._id,
          },
        });

      const promises = [overview, top].map(fetchedData);

      Promise.all(promises)
        .then((response) => {
          this.emptyData = response[0].status === 204 ? true : false;

          this.totalOverview = response[0].data.reverse();
          this.totalTop = response[1].data;
          console.log(this.totalTop);
          this.pushToChart();
          this.preCalculateFilteredArrays();

          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    this.fetchData();
  },
};
</script>

<style>
.table-image {
  @apply object-cover w-9 h-9 rounded-full;
}
.tab {
  @apply py-2 px-6 cursor-pointer text-gray-500 hover:bg-white dark:hover:bg-gray-700-spotify dark:hover:text-gray-200 transition ease-in-out duration-75;
}
.is-active {
  @apply bg-white dark:bg-gray-600-spotify dark:text-gray-200;
}
.not-active {
  @apply dark:bg-gray-900-spotify bg-gray-200;
}
.total-played-listened {
  @apply block text-2xl text-gray-600 dark:text-gray-100 font-light tracking-wide mb-2;
}
.total-played-listened-number {
  @apply block text-4xl text-gray-600 dark:text-gray-100 font-bold tracking-wide mb-2;
}
</style>

<style src="@/assets/chart.css"></style>
