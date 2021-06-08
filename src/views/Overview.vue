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
          :value="totals[selectedPeriod].totalTracksPlayed"
          :previousValue="totals[selectedPeriod].totalTracksPlayedPrev"
        >
          Tracks Played
        </card>
        <card
          :selected="selectedPeriod"
          :value="totals[selectedPeriod].totalMinutesListened"
          :previousValue="totals[selectedPeriod].totalMinutesListenedPrev"
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
import * as utd from "@/utils/dates";
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
    totalTopExists() {
      if (this.totalTop.playlists?.length) return true;
      return false;
    },
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
  methods: {
    updateOverview(period) {
      this.selectedPeriod = period;
      this.updateChart(period);
    },
    updateChart(period) {
      if (period === "alltime") {
        this.$apexcharts.exec(
          "chart",
          "zoomX",
          this.firstDayOnGraph,
          this.currentDate
        );
      }
      if (period === "week") {
        this.$apexcharts.exec(
          "chart",
          "zoomX",
          utd.firstDayOfWeek,
          this.currentDate
        );
      }
      if (period === "month") {
        this.$apexcharts.exec(
          "chart",
          "zoomX",
          utd.firstDayOfMonth,
          this.currentDate
        );
      }
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
  async created() {
    const response = await Promise.all([getOverview(), getTop()]);

    const overview = response[0].overview.reverse();
    this.totalOverview = overview;
    this.totalTop = response[1].top;
    this.emptyData = response[0].status === 204 ? true : false;
    this.loading = false;

    this.pushToChart();
    this.calculateAllTotals();
  },
};
</script>

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
