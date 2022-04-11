<template>
  <line-chart
    :chart-data="chartData"
    :options="chartOptions"
    :width="220"
    :height="300"
  />
</template>

<script setup>
import { ref, computed } from "vue";
import { LineChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { getProfileGenresReport } from "@/api";
import {
  randomColor,
  transparentize,
  nullish,
  skipped,
} from "@/utils/chart.js";
import { formatDate } from "@/utils";

Chart.register(...registerables, ChartDataLabels);

const props = defineProps({
  username: {
    type: String,
    required: true,
  },
});

const genresData = ref([]);

genresData.value = await getProfileGenresReport({ username: props.username });
genresData.value.reverse();

const INDEX_TO_VALUE = {
  0: 5,
  1: 4,
  2: 3,
  3: 2,
  4: 1,
};

const PLACE_OPTIONS = {
  5: "1",
  4: "2",
  3: "3",
  2: "4",
  1: "5",
  0: "",
};

const formattedGenres = computed(() => {
  const dates = genresData.value.map((item) => item.date);

  const genres = [
    ...new Set(genresData.value.map((item) => item.genres).flat(1)),
  ];

  const flatData = genresData.value.reduce((acc, item) => {
    genres.forEach((genre) => {
      const index = item.genres.findIndex((label) => label === genre);
      acc.push({
        label: genre,
        value: INDEX_TO_VALUE[index] || NaN,
        date: dates.findIndex((date) => date === item.date),
      });
    });
    return acc;
  }, []);

  const data = flatData.reduce((acc, current) => {
    const { date, label, value } = current;

    const foundIndex = acc.findIndex((item) => item.label === label);
    const foundItem = acc[foundIndex];

    if (foundIndex === -1) {
      acc.push({ label, data: [value] });
    } else {
      foundItem.data[date] = value;
    }
    return acc;
  }, []);

  const filteredData = data.filter((genre) =>
    genre.data.find((item) => !isNaN(item))
  );

  const datasets = filteredData.map((item, index) => {
    const color = randomColor(index);
    const transparentizedColor = transparentize(color, 0.8);

    return {
      label: item.label,
      data: item.data,
      cubicInterpolationMode: "monotone",
      borderColor: color,
      borderWidth: 5,
      clip: 2,
      spanGaps: true,
      segment: {
        borderColor: (ctx) => nullish(ctx, transparentizedColor),
        borderDash: (ctx) => skipped(ctx, [6, 16]),
      },
    };
  });

  return {
    labels: dates.map((date) => formatDate(date)),
    datasets,
  };
});

const chartData = computed(() => ({
  labels: formattedGenres.value.labels,
  datasets: formattedGenres.value.datasets,
}));

const chartOptions = {
  interaction: {
    intersect: false,
  },
  elements: {
    point: {
      radius: (ctx) => {
        const dataset = ctx.dataset.data;
        const index = ctx.dataIndex;

        const range = dataset.slice(index - 1, index + 2);
        const canShow = range.some((item) => isNaN(item)) || !range.length;

        return canShow ? 2 : 0;
      },
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
      color: "white",
      font: {
        weight: "bold",
      },
      backgroundColor: "black",
      borderRadius: 4,
      padding: 2,
      align: "bottom",
      clamp: true,
      formatter: function (value, ctx) {
        return ctx.dataset.label;
      },
      display: function (ctx) {
        const firstNonNaN = ctx.dataset.data.find((item) => !isNaN(item));
        const firstNonNaNIndex = ctx.dataset.data.indexOf(firstNonNaN);
        return ctx.dataIndex === firstNonNaNIndex + 1;
      },
    },
  },
  scales: {
    y: {
      display: true,
      title: {
        display: false,
      },
      min: 0,
      max: 5,
      ticks: {
        stepSize: 1,
        callback: function (value) {
          return PLACE_OPTIONS[value];
        },
        crossAlign: "far",
        color: "white",
        font: {
          size: 16,
        },
      },
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
