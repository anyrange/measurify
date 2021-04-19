<template>
  <div class="container mx-auto">
    <template v-if="loading">
      <div class="mt-8">
        <LoadingSpinner />
      </div>
    </template>
    <template v-else>
      <div class="mt-4">
        <div class="md:flex items-center">
          <kinesis-container>
            <kinesis-element :strength="10" type="depth">
              <img
                :src="object.track.image"
                class="w-56 h-56 mr-6 object-cover"
              />
            </kinesis-element>
          </kinesis-container>
          <div class="flex flex-col space-y-2 text-gray-500-spotify">
            <span class="text-5xl font-semibold mt-2 md:mt-0">
              {{ object.track.name }}
            </span>
            <span class="text-lg"
              >By <a class="text-white">{{ object.track.artist.name }}</a>
            </span>
            <span class="text-lg"
              >From <a class="text-white">{{ object.track.album.name }}</a>
            </span>
            <span class="text-lg"
              >{{ object.track.release }} -
              {{ trackDuration }}
            </span>
          </div>
        </div>
        <div class="mt-6">
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
        </div>
        <div class="grid gap-7 xl:grid-cols-4 lg:grid-cols-2 mb-2 mt-6">
          <Card
            :title="'Times Played'"
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
      </div>
    </template>
  </div>
</template>

<script>
import axios from "axios";
import LoadingSpinner from "@/components/LoadingSpinner";
import { addSeconds, format } from "date-fns";
import Card from "@/components/Card";
import * as fd from "@/utils/dates";
import chartOptions from "@/mixins/chartOptions";

export default {
  components: {
    LoadingSpinner,
    Card,
  },
  mixins: [chartOptions],
  data() {
    return {
      loading: true,
      selectedPeriod: "alltime",

      object: {},
      totalOverview: [],

      newDates: [],
      newValues: [],

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
    trackDuration() {
      return format(
        addSeconds(new Date(0), this.object.track.duration_ms / 1000),
        "mm:ss"
      );
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
  created() {
    axios
      .get(
        `${this.$store.getters.getBackendURL}/track/${this.$route.params.id}`,
        {
          headers: {
            Authorization: this.user._id,
          },
        }
      )
      .catch((err) => console.log(err))
      .then((response) => {
        console.log(response.data);
        this.object = response.data;
        this.totalOverview = response.data.overview.reverse();
        this.pushToChart();
        this.preCalculateFilteredArrays();
        document.title = `${this.object.track.name} - Spotiworm`;
      })
      .finally(() => (this.loading = false));
  },
  methods: {
    updateOverview(period) {
      this.selectedPeriod = period;
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
  },
};
</script>

<style lang="postcss" scoped></style>
