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
      <div class="-mx-4 w-full">
        <apexchart
          ref="chart"
          type="area"
          height="350"
          :options="chartOptions"
          :series="overviewData"
        ></apexchart>
      </div>
      <h2 class="mt-6 text-4xl font-semibold text-gray-100">
        Top Played
      </h2>
      <tabs class="my-6" v-model="selectedTop">
        <tab name="artists">Artists</tab>
        <tab name="tracks">Track</tab>
        <tab name="albums">Albums</tab>
        <tab name="playlists" :visible="totalTopExists">Playlists</tab>
      </tabs>
      <rating-table :title="selectedTop" :data="totalTop[selectedTop]" />
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
import VueApexCharts from "vue3-apexcharts";

export default {
  name: "Overview",
  components: {
    Card,
    RatingTable,
    EmptyMessage,
    Tabs,
    Tab,
    apexchart: VueApexCharts,
  },
  mixins: [chartOptions],
  data() {
    return {
      loading: true,
      emptyData: false,

      selectedPeriod: "alltime",
      selectedTop: "artists",

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
    totalTopExists() {
      if (this.totalTop.playlists?.length) return true;
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
    currentDate() {
      const now = new Date();
      now.setHours(6, 0, 0, 0);
      return new Date(now).getTime();
    },
    firstDayOnGraph() {
      const res = this.chartOptions.xaxis.categories[0];
      return new Date(res).getTime();
    },
  },
  methods: {
    updateOverview(period) {
      this.selectedPeriod = period;
      this.updateChart(period);
    },
    updateChart(period) {
      // console.log(this.$refs.chart);
      // console.log(this.$apexcharts);

      this.tracksPlayed = [];
      this.minutesListened = [];
      this.prevTracksPlayed = [];
      this.prevMinutesListened = [];

      if (period === "alltime") {
        this.$apexcharts.exec(
          "chart",
          "zoomX",
          this.firstDayOnGraph,
          this.currentDate
        );
        // this.$refs.chart.zoomX(this.firstDayOnGraph, this.currentDate);
        this.updateTotals(this.totalOverview);
      }

      if (period === "week") {
        this.$apexcharts.exec(
          "chart",
          "zoomX",
          fd.firstDayOfWeek,
          this.currentDate
        );
        // this.$refs.chart.zoomX(fd.firstDayOfWeek, this.currentDate);
        this.updateTotals(this.week, this.prevWeek);
      }

      if (period === "month") {
        this.$apexcharts.exec(
          "chart",
          "zoomX",
          fd.firstDayOfMonth,
          this.currentDate
        );
        // this.$refs.chart.zoomX(fd.firstDayOfMonth, this.currentDate);
        this.updateTotals(this.month, this.prevMonth);
      }
    },
    updateTotals(arr, prev) {
      for (const item of arr) {
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
    const overview = response[0].overview.reverse();
    console.log(overview);
    // overview.push({ date: "2021-06-08", duration: 107, plays: 27 });
    this.totalOverview = overview;
    this.totalTop = response[1].top;
    this.emptyData = response[0].status === 204 ? true : false;
    this.loading = false;

    this.pushToChart();
    this.preCalculateFilteredArrays();
  },
};
</script>

<style src="@/assets/chart.css"></style>
