<template>
  <h2 class="h-title">Overview</h2>
  <template v-if="emptyData">
    <empty-message />
  </template>
  <template v-else>
    <loading-spinner v-if="loading" />
    <template v-else>
      <div class="mt-6">
        <ul class="tabs sm:flex">
          <li
            class="tab sm:rounded-l-lg sm:rounded-t-none rounded-t-lg"
            :class="[selectedPeriod === 'alltime' ? 'is-active' : 'not-active']"
            @click="updateOverview('alltime')"
          >
            All Time
          </li>
          <li
            class="tab"
            :class="[selectedPeriod === 'week' ? 'is-active' : 'not-active']"
            @click="updateOverview('week')"
          >
            This Week
          </li>
          <li
            class="tab sm:rounded-r-lg sm:rounded-b-none rounded-b-lg"
            :class="[selectedPeriod === 'month' ? 'is-active' : 'not-active']"
            @click="updateOverview('month')"
          >
            This Month
          </li>
        </ul>
        <div class="grid gap-7 xl:grid-cols-4 lg:grid-cols-2 mb-2 mt-6">
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
        <div class="-mx-4 w-full">
          <apexchart
            type="area"
            height="350"
            :options="chartOptions"
            :series="overviewData"
          ></apexchart>
        </div>
        <h2
          class="mt-5 mb-8 text-4xl font-semibold dark:text-gray-100 text-gray-900"
        >
          Top Played
        </h2>
        <div class="mt-6">
          <ul class="tabs sm:flex">
            <li
              class="tab sm:rounded-l-lg sm:rounded-t-none rounded-t-lg"
              :class="[selectedTop === 'artists' ? 'is-active' : 'not-active']"
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
              :class="[
                selectedTop === 'albums' ? 'is-active' : 'not-active',
                !playlistsExist
                  ? 'sm:rounded-r-lg sm:rounded-b-none rounded-b-lg'
                  : '',
              ]"
              @click="selectedTop = 'albums'"
            >
              Albums
            </li>
            <template v-if="playlistsExist">
              <li
                class="tab sm:rounded-r-lg sm:rounded-b-none rounded-b-lg"
                :class="[
                  selectedTop === 'playlists' ? 'is-active' : 'not-active',
                ]"
                @click="selectedTop = 'playlists'"
              >
                Playlists
              </li>
            </template>
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
</template>

<script>
import * as fd from "@/utils/dates";
import chartOptions from "@/mixins/chartOptions";
import EmptyMessage from "@/components/EmptyMessage";
import Table from "@/components/Table";
import Card from "@/components/Card";
import api from "@/api";

export default {
  components: {
    Card,
    Table,
    EmptyMessage,
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
    playlistsExist() {
      if (this.totalTop.playlists?.length) {
        return true;
      }
      return false;
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
      api
        .getOverview()
        .then((response) => {
          if (response.status === 204) {
            return (this.emptyData = true);
          }
          this.totalOverview = response.reverse();
          this.pushToChart();
          this.preCalculateFilteredArrays();
          api
            .getTop()
            .then((response) => {
              this.totalTop = response;
              this.loading = false;
            })
            .catch((error) => {
              this.$notify.show({
                type: "danger",
                message: error.response.data.message,
              });
            });
        })
        .catch((error) => {
          this.$notify.show({
            type: "danger",
            message: error.response.data.message,
          });
        });
    },
  },
  created() {
    this.fetchData();
  },
};
</script>

<style lang="postcss">
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
