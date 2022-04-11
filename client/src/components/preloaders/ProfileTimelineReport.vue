<template>
  <bar-chart :chart-data="chartData" :options="chartOptions" />
</template>

<script setup>
import { ref, computed } from "vue";
import { BarChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";
import { getProfileTimelineReport } from "@/api";
import { formatDateShorter } from "@/utils";

Chart.register(...registerables);

const props = defineProps({
  username: {
    type: String,
    required: true,
  },
});

const timeline = ref([]);

timeline.value = await getProfileTimelineReport({ username: props.username });
timeline.value.reverse();

const formattedTimeline = computed(() => {
  const labels = timeline.value
    .slice(0, 15)
    .map((item) => formatDateShorter(item.date));

  const playsDataset = {
    label: "Plays",
    data: timeline.value.map((item) => item.plays),
    borderColor: "rgba(35,173,80,1)",
    backgroundColor: ["rgba(31,198,89, 0.2)", "rgba(35,173,80, 0.1)"],
    borderWidth: 1,
    fill: true,
  };

  const datasets = [playsDataset];

  return {
    labels,
    datasets,
  };
});

const chartData = computed(() => ({
  labels: formattedTimeline.value.labels,
  datasets: formattedTimeline.value.datasets,
}));

const chartOptions = {
  interaction: {
    intersect: false,
  },
  elements: {
    point: {
      radius: 0,
    },
    line: {
      tension: 0.4,
      radius: 6,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
    },
    datalabels: {
      display: true,
      color: "white",
      anchor: "end",
      align: "top",
    },
  },
  scales: {
    y: {
      display: false,
      grid: {
        display: false,
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};
</script>
