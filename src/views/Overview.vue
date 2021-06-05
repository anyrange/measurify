<template>
  <h2 class="h-title">Overview</h2>
  <loading-spinner v-if="loading" />
  <template v-else>
    <empty-message v-if="emptyData" />
    <template v-else>
      <tabs class="mt-6" v-model="selectedPeriod">
        <tab name="alltime" @click="updateOverview('alltime')">All Time</tab>
        <tab name="week" @click="updateOverview('week')">This Week</tab>
        <tab name="month" @click="updateOverview('month')">This Month</tab>
      </tabs>
      <div class="mt-6 grid gap-7 xl:grid-cols-4 lg:grid-cols-2">
        <card
          :selected="selectedPeriod"
          :value="totalTracksPlayed"
          :previousValue="totalTracksPlayedPrev"
        >
          Tracks Played
        </card>
        <card
          :selected="selectedPeriod"
          :value="totalMinutesListened"
          :previousValue="totalMinutesListenedPrev"
        >
          Minutes Listened
        </card>
      </div>
      <apexchart
        class="-mx-4 w-full"
        height="350"
        type="area"
        :options="chartOptions"
        :series="overviewData"
      />
      <h2 class="mt-6 text-4xl font-semibold text-gray-100">
        Top Played
      </h2>
      <tabs class="mt-6" v-model="selectedTop">
        <tab name="artists">Artists</tab>
        <tab name="tracks">Track</tab>
        <tab name="albums">Albums</tab>
        <tab name="playlists" :disabled="!this.totalTop.playlists?.length">
          Playlists
        </tab>
      </tabs>
      <rating-table
        class="mt-3"
        :title="selectedTop"
        :data="totalTop[selectedTop]"
      />
    </template>
  </template>
</template>

<script>
import * as fd from "@/utils/dates";
import chartOptions from "@/mixins/chartOptions";
import EmptyMessage from "@/components/EmptyMessage";
import RatingTable from "@/components/RatingTable";
import Card from "@/components/Card";
import Tabs from "@/components/Tabs";
import Tab from "@/components/Tab";
import { getOverview, getTop } from "@/api";

export default {
  name: "Overview",
  components: { Card, RatingTable, EmptyMessage, Tabs, Tab },
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
      this.updateChart(period);
    },
    updateChart(period) {
      this.newDates = [];
      this.newValues = [];

      this.tracksPlayed = [];
      this.minutesListened = [];
      this.prevTracksPlayed = [];
      this.prevMinutesListened = [];

      if (period === "alltime") this.updateTotals(this.totalOverview);
      if (period === "week") this.updateTotals(this.week, this.prevWeek);
      if (period === "month") this.updateTotals(this.month, this.prevMonth);

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
      this.chartOptions = { xaxis: { categories: this.newDates } };
      this.overviewData = [{ data: this.newValues }];
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
  async created() {
    const response = await Promise.all([getOverview(), getTop()]);

    this.totalOverview = response[0].overview.reverse();
    this.totalTop = response[1].top;
    this.emptyData = response[0].status === 204 ? true : false;
    this.loading = false;

    this.pushToChart();
    this.preCalculateFilteredArrays();
  },
};
</script>

<style src="@/assets/chart.css"></style>
