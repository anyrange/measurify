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
          <div class="px-4">
            <ul class="flex">
              <li
                class="tab rounded-l-lg"
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
                class="tab rounded-r-lg"
                :class="[
                  selectedPeriod === 'month' ? 'is-active' : 'not-active',
                ]"
                @click="updateOverview('month')"
              >
                This month
              </li>
            </ul>
          </div>
          <div class="mx-4 mt-6 md:flex mb-6">
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
          <div class="mt-6 px-4">
            <ul class="flex">
              <li
                :class="[
                  selectedTop === 'artists' ? 'is-active' : 'not-active',
                ]"
                @click="selectedTop = 'artists'"
                class="tab rounded-l-lg"
              >
                Artists
              </li>
              <li
                :class="[selectedTop === 'tracks' ? 'is-active' : 'not-active']"
                @click="selectedTop = 'tracks'"
                class="tab"
              >
                Tracks
              </li>
              <li
                :class="[selectedTop === 'albums' ? 'is-active' : 'not-active']"
                @click="selectedTop = 'albums'"
                class="tab rounded-r-lg"
              >
                Albums
              </li>
            </ul>
            <div class="mt-4">
              <div v-if="selectedTop === 'artists'">
                <table class="w-full table-fixed">
                  <thead>
                    <tr>
                      <th class="history-th w-7/10 text-left">
                        Artist
                      </th>
                      <th class="history-th w-3/10 text-right">
                        Minutes Listened
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in totalTop.artists"
                      :key="item.id"
                      class="history-tr"
                    >
                      <td class="history-td text-left">
                        <div class="flex items-center">
                          <div class="mr-5">
                            {{ index + 1 }}
                          </div>
                          <img :src="item?.image" class="table-image" />
                          <div class="ml-4">
                            {{ item.name }}
                          </div>
                        </div>
                      </td>
                      <td class="history-td text-right">
                        {{ item.playtime }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-if="selectedTop === 'tracks'">
                <table class="w-full table-fixed">
                  <thead>
                    <tr>
                      <th class="history-th w-7/10 text-left">
                        Track
                      </th>
                      <th class="history-th w-3/10 text-right">
                        Minutes Listened
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in totalTop.tracks"
                      :key="item.id"
                      class="history-tr"
                    >
                      <td class="history-td text-left">
                        <div class="flex items-center">
                          <div class="mr-5">
                            {{ index + 1 }}
                          </div>
                          <img :src="item?.image" class="table-image" />
                          <div class="ml-4">
                            {{ item.name }}
                          </div>
                        </div>
                      </td>
                      <td class="history-td text-right">
                        {{ item.playtime }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-if="selectedTop === 'albums'">
                <table class="w-full table-fixed">
                  <thead>
                    <tr>
                      <th class="history-th w-7/10 text-left">
                        Album
                      </th>
                      <th class="history-th w-3/10 text-right">
                        Minutes Listened
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in totalTop.albums"
                      :key="item.id"
                      class="history-tr"
                    >
                      <td class="history-td text-left">
                        <div class="flex items-center">
                          <div class="mr-5">
                            {{ index + 1 }}
                          </div>
                          <img :src="item?.image" class="table-image" />
                          <div class="ml-4">
                            {{ item.name }}
                          </div>
                        </div>
                      </td>
                      <td class="history-td text-right">
                        {{ item.playtime }}
                      </td>
                    </tr>
                  </tbody>
                </table>
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
import LoadingSpinner from "@/components/LoadingSpinner";
import chartOptions from "@/mixins/chartOptions";
import {
  getFirstDayOfWeek,
  getLastDateOfWeek,
  getFirstDayOfMonth,
  getLastDayOfMonth,
} from "@/utils/dates";
import axios from "axios";
// import { format } from "date-fns";

export default {
  components: {
    LoadingSpinner,
  },

  mixins: [chartOptions],

  data() {
    return {
      loading: true,
      selectedTop: "artists",
      selectedPeriod: "alltime",

      totalOverview: [],
      totalTop: [],

      allDates: [],
      tracksPlayed: [],
      minutesListened: [],
      totalTracksPlayed: 0,
      totalMinutesListened: 0,

      emptyData: false,

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
    getTotalTracksPlayed(arr) {
      this.totalTracksPlayed = arr.reduce(function(a, b) {
        return a + b;
      }, 0);
    },

    getTotalMinutesListened(arr) {
      this.totalMinutesListened = arr.reduce(function(a, b) {
        return a + b;
      }, 0);
    },

    updateChart(period) {
      const filterTotalOverview = (array, firstDate, lastDate) =>
        array.filter((item) => {
          let date = new Date(item.date).getTime();
          return firstDate < date && date < lastDate;
        });
      const firstDayOfWeek = getFirstDayOfWeek();
      const lastDayOfWeek = getLastDateOfWeek();
      const firstDayOfMonth = getFirstDayOfMonth();
      const lastDayOfMonth = getLastDayOfMonth();

      if (period == "alltime") {
        const newDates = [];
        const newValues = [];
        this.tracksPlayed = [];
        this.minutesListened = [];

        for (const item of this.totalOverview) {
          newDates.push(item.date);
          newValues.push(item.plays);
          this.tracksPlayed.push(item.plays);
          this.minutesListened.push(item.duration);
        }
        this.getTotalTracksPlayed(this.tracksPlayed);
        this.getTotalMinutesListened(this.minutesListened);

        this.chartOptions = {
          xaxis: {
            categories: newDates,
          },
        };
        this.overviewData = [
          {
            data: newValues,
          },
        ];
      }
      if (period == "week") {
        const filtetedOverviewByWeek = filterTotalOverview(
          this.totalOverview,
          firstDayOfWeek,
          lastDayOfWeek
        );

        const newDates = [];
        const newValues = [];
        this.tracksPlayed = [];
        this.minutesListened = [];

        for (const item of filtetedOverviewByWeek) {
          newDates.push(item.date);
          newValues.push(item.plays);
          this.tracksPlayed.push(item.plays);
          this.minutesListened.push(item.duration);
        }

        this.updateNumbers();

        this.chartOptions = {
          xaxis: {
            categories: newDates,
          },
        };
        this.overviewData = [
          {
            data: newValues,
          },
        ];
      }
      if (period == "month") {
        const filtetedOverviewByMonth = filterTotalOverview(
          this.totalOverview,
          firstDayOfMonth,
          lastDayOfMonth
        );

        const newDates = [];
        const newValues = [];
        this.tracksPlayed = [];
        this.minutesListened = [];

        for (const item of filtetedOverviewByMonth) {
          newDates.push(item.date);
          newValues.push(item.plays);
          this.tracksPlayed.push(item.plays);
          this.minutesListened.push(item.duration);
        }

        this.updateNumbers();

        this.chartOptions = {
          xaxis: {
            categories: newDates,
          },
        };
        this.overviewData = [
          {
            data: newValues,
          },
        ];
      }
    },
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
    updateNumbers() {
      this.getTotalTracksPlayed(this.tracksPlayed);
      this.getTotalMinutesListened(this.minutesListened);
    },
    pushToChart() {
      for (const item of this.totalOverview) {
        this.overviewData[0].data.push(item.plays);
        this.chartOptions.xaxis.categories.push(item.date);
        this.allDates.push(item.date);
        this.tracksPlayed.push(item.plays);
        this.minutesListened.push(item.duration);
      }
      this.updateNumbers();
    },
    getOverview() {
      axios
        .get(`${process.env.VUE_APP_SERVER_URI}/overview`, {
          headers: {
            Authorization: this.user._id,
          },
        })
        .then((response) => {
          this.totalOverview = response.data;
          this.pushToChart();
          this.emptyData = this.totalOverview.length > 1 ? false : true;
        })
        .catch((err) => console.log(err))
        .finally(() => (this.loading = false));
    },
    getTop() {
      axios
        .get(`${process.env.VUE_APP_SERVER_URI}/top`, {
          headers: {
            Authorization: this.user._id,
          },
        })
        .then((response) => {
          this.totalTop = response.data;
        })
        .catch((err) => console.log(err));
      // .finally(() => (this.loading = false))
    },
  },
  created() {
    this.getOverview();
    this.getTop();
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

<style>
.apexcharts-text {
  font-family: "Inter", sans-serif !important;
}
.apexcharts-zoomin-icon,
.apexcharts-zoomout-icon,
.apexcharts-zoom-icon.apexcharts-selectedTop,
.apexcharts-pan-icon,
.apexcharts-menu-icon {
  display: none;
}
.apexcharts-zoom-icon.apexcharts-selected {
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
