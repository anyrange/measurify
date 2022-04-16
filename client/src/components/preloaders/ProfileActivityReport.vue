<template>
  <polar-area-chart
    :chart-data="chartData"
    :options="chartOptions"
    :width="300"
    :height="300"
  />
  <cards class="flex items-center justify-center">
    <card :title="activityHours.timeString12hr"> most active hour </card>
  </cards>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { PolarAreaChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";
import { useProfileStore } from "@/stores/profile";
import { getProfileActivityReport } from "@/api";
import { getTwelveHourTime } from "@/utils";

Chart.register(...registerables);

const props = defineProps({
  username: {
    type: String,
    required: true,
  },
  range: {
    type: String,
    required: true,
  },
});

const profileStore = useProfileStore();

const activity = ref([]);

const fetchData = async () => {
  activity.value = await getProfileActivityReport({
    username: props.username,
    options: {
      ...profileStore.dateRanges[props.range],
    },
  });
};

await fetchData();

watch(props, fetchData);

const activityHours = computed(() => {
  const activityData = activity.value.map((item) => item.plays);
  const hourOffset = new Date().getTimezoneOffset() / 60;

  if (hourOffset < 0) {
    const shift = activityData.splice(hourOffset, Math.abs(hourOffset));
    activityData.unshift(...shift);
  } else {
    const shift = activityData.splice(0, hourOffset);
    activityData.push(...shift);
  }

  const playsPerHour = Math.floor(activityData.reduce((a, b) => a + b, 0) / 60);

  const mostActiveHour = Math.max(...activityData);
  const mostActiveHourIndex = activityData.indexOf(mostActiveHour);

  const timeString12hr = getTwelveHourTime(`${mostActiveHourIndex}:00`);

  return {
    activity: activityData,
    mostActiveHour,
    playsPerHour,
    timeString12hr,
  };
});

const chartData = computed(() => {
  const createLabels = () => {
    const array = Array.from({ length: 24 }, (v, k) => k);
    array[0] = "24";
    return array;
  };
  return {
    labels: createLabels(),
    datasets: [
      {
        data: activityHours.value.activity,
        backgroundColor: ["rgba(35,173,80, 0.9)", "rgba(31,198,89, 0.7)"],
        hoverBackgroundColor: "#21F04C",
        borderWidth: 1.5,
        borderColor: "#121212",
        borderJoinStyle: "round",
        borderAlign: "inner",
      },
    ],
  };
});

const chartOptions = computed(() => ({
  scales: {
    r: {
      pointLabels: {
        display: true,
        font: {
          size: 16,
        },
      },
      min: 0,
      max: activityHours.value.mostActiveHour,
      ticks: {
        stepSize: 1,
        display: false,
      },
      grid: {
        display: false,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: false,
    },
    datalabels: {
      display: false,
    },
  },
}));
</script>
