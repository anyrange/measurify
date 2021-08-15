<template>
  <h1 class="h-title">Overview</h1>
  <loading-spinner v-if="loading" />
  <template v-else>
    <empty-message v-if="emptyData" />
    <template v-else>
      <tabs v-model="selectedPeriod">
        <tab name="alltime">All Time</tab>
        <tab name="month">This Month</tab>
        <tab name="week">This Week</tab>
      </tabs>
      <div class="content-cards">
        <percent-card
          :value="totals[selectedPeriod].totalTracksPlayed"
          :previousValue="totals[selectedPeriod].totalTracksPlayedPrev"
        >
          Tracks Played
        </percent-card>
        <percent-card
          :value="totals[selectedPeriod].totalMinutesListened"
          :previousValue="totals[selectedPeriod].totalMinutesListenedPrev"
        >
          Minutes Listened
        </percent-card>
      </div>
      <div v-if="!isMobile" class="-mx-4 w-full">
        <apexchart
          type="area"
          height="350"
          :options="chartOptions"
          :series="overviewData"
        ></apexchart>
      </div>
      <h1 class="h-title">Top Played</h1>
      <tabs v-model="selectedTop">
        <tab name="artists">Artists</tab>
        <tab name="tracks">Tracks</tab>
        <tab name="albums">Albums</tab>
        <tab name="playlists" :visible="!!this.totalTop.playlists.length">
          Playlists
        </tab>
      </tabs>
      <rating-table :title="selectedTop" :data="totalTop[selectedTop]" />
    </template>
  </template>
</template>

<script>
import * as utd from "@/utils/dates";
import dashboardChart from "@/mixins/dashboardChart";
import EmptyMessage from "@/components/EmptyMessage";
import RatingTable from "@/components/RatingTable";
import PercentCard from "@/components/PercentCard";
import Tabs from "@/components/Tabs";
import Tab from "@/components/Tab";
import { getOverview, getTop } from "@/api";
import VueApexCharts from "vue3-apexcharts";

export default {
  name: "Overview",
  components: {
    PercentCard,
    RatingTable,
    EmptyMessage,
    Tabs,
    Tab,
    apexchart: VueApexCharts,
  },
  mixins: [dashboardChart],
  data() {
    return {
      loading: true,
      emptyData: false,
      selectedPeriod: "alltime",
      selectedTop: "artists",
      overviewData: [{ name: "Plays", data: [] }],
      totalOverview: [],
      totalTop: [],
      totals: {
        alltime: {},
        week: {},
        month: {},
      },
      week: {
        current: [],
        previous: [],
      },
      month: {
        current: [],
        previous: [],
      },
    };
  },
  computed: {
    currentDate() {
      const now = new Date();
      const date = new Date(now).toISOString().substr(0, 10);
      return new Date(date).getTime();
    },
    firstDayOnGraph() {
      const res = this.chartOptions.xaxis.categories[0];
      return new Date(res).getTime();
    },
  },
  watch: {
    selectedPeriod() {
      if (!this.isMobile) this.updateChart(this.selectedPeriod);
    },
  },
  async created() {
    const [{ overview, status: overviewStatus }, { top }] = await Promise.all([
      getOverview(),
      getTop(),
    ]);
    this.totalOverview = overview.reverse();
    this.totalTop = top;
    this.emptyData = overviewStatus === 204;
    this.loading = false;
    this.pushToChart();
    this.calculateAllTotals();
  },
  methods: {
    updateChart(period) {
      switch (period) {
        case "alltime":
          this.zoomChart(this.firstDayOnGraph, this.currentDate);
          break;
        case "month":
          this.zoomChart(utd.firstDayOfMonth, this.currentDate);
          break;
        case "week":
          this.zoomChart(utd.firstDayOfWeek, this.currentDate);
          break;
        default:
          break;
      }
    },
    zoomChart(start, end) {
      this.$apexcharts.exec("dashboardChart", "zoomX", start, end);
    },
    pushToChart() {
      for (const item of this.totalOverview) {
        this.overviewData[0].data.push(item.plays);
        this.chartOptions.xaxis.categories.push(item.date);
      }
    },
    getFilteredArray({ array = this.totalOverview, first, last }) {
      return array.filter((item) => {
        let date = new Date(item.date).getTime();
        return first <= date && date < last;
      });
    },
    getSumOfArray(array) {
      return array.reduce((a, b) => a + b, 0);
    },
    getTotals(object, array, prevArray) {
      const tracksPlayed = [];
      const minutesListened = [];
      const prevTracksPlayed = [];
      const prevMinutesListened = [];
      for (const item of array) {
        tracksPlayed.push(item.plays);
        minutesListened.push(item.duration);
      }
      object.totalTracksPlayed = this.getSumOfArray(tracksPlayed);
      object.totalMinutesListened = this.getSumOfArray(minutesListened);

      if (!prevArray) {
        object.totalTracksPlayedPrev = 0;
        object.totalMinutesListenedPrev = 0;
        return;
      }

      for (const item of prevArray) {
        prevTracksPlayed.push(item.plays);
        prevMinutesListened.push(item.duration);
      }
      object.totalTracksPlayedPrev = this.getSumOfArray(prevTracksPlayed);
      object.totalMinutesListenedPrev = this.getSumOfArray(prevMinutesListened);
    },
    calculateAllTotals() {
      this.week.current = this.getFilteredArray({
        first: utd.firstDayOfWeek,
        last: utd.lastDayOfWeek,
      });
      this.week.previous = this.getFilteredArray({
        first: utd.firstDayOfPreviousWeek,
        last: utd.lastDayOfPreviousWeek,
      });
      this.month.current = this.getFilteredArray({
        first: utd.firstDayOfMonth,
        last: utd.lastDayOfMonth,
      });
      this.month.previous = this.getFilteredArray({
        first: utd.firstDayOfPreviousMonth,
        last: utd.lastDayOfPreviousMonth,
      });
      this.getTotals(this.totals.week, this.week.current, this.week.previous);
      this.getTotals(
        this.totals.month,
        this.month.current,
        this.month.previous
      );
      this.getTotals(this.totals.alltime, this.totalOverview);
    },
  },
};
</script>

<style>
.apexcharts-tooltip.apexcharts-theme-light {
  background-color: #181818 !important;
  border: 1px solid #464846 !important;
  box-shadow: 0px 0px 0px 0px #fff !important;
  border-radius: 0px !important;
  color: #1cd460 !important;
  padding: 4px !important;
}
.apexcharts-tooltip-title {
  border: 0 !important;
  font-size: 16px !important;
  color: #fff !important;
  background-color: #181818 !important;
  margin-bottom: 0px !important;
}
.apexcharts-tooltip-marker {
  background-color: #1da14b !important;
}
.apexcharts-tooltip-text {
  font-size: 14px !important;
}
.apexcharts-tooltip-text-value {
  font-weight: normal !important;
}
.apexcharts-tooltip-y-group {
  padding: 0 !important;
}
</style>
