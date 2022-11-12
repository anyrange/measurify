<template>
  <bar-chart :chart-data="chartData" :options="chartOptions" />
</template>

<script setup>
import { ref, computed, watch } from "vue"
import { BarChart } from "vue-chart-3"
import { Chart, registerables } from "chart.js"
import { useProfileStore } from "@/stores/profile"
import { getProfileTimelineReport } from "@/api"
import { formatDateShorter } from "@/utils"
import dayjs from "@/dayjs"

Chart.register(...registerables)

const props = defineProps({
  username: {
    type: String,
    required: true,
  },
  range: {
    type: String,
    required: true,
  },
})

const profileStore = useProfileStore()

const timeline = ref([])

const isGroupedData = computed(() => {
  return props.range !== "week"
})

const fetchData = async () => {
  const data = await getProfileTimelineReport({
    username: props.username,
    options: {
      ...profileStore.dateRanges[props.range],
    },
  })
  data.reverse()

  const groupedData = data.reduce((acc, current) => {
    const { date, plays } = current

    const formattedDate = new Date(date).toISOString()
    const weekDate = dayjs(formattedDate).startOf("week").format()

    const foundIndex = acc.findIndex((item) => item.date === weekDate)
    const foundItem = acc[foundIndex]

    if (foundIndex === -1) {
      acc.push({ date: weekDate, plays })
    } else {
      foundItem.plays += plays
    }

    return acc
  }, [])

  timeline.value = isGroupedData.value ? groupedData : data
}

await fetchData()

watch(props, fetchData)

const formattedTimeline = computed(() => {
  const labels = timeline.value.map((item) => formatDateShorter(item.date))

  const playsDataset = {
    label: "Plays",
    data: timeline.value.map((item) => item.plays),
    borderColor: "rgba(35,173,80,1)",
    backgroundColor: ["rgba(31,198,89, 0.2)", "rgba(35,173,80, 0.1)"],
    borderWidth: 1,
    fill: true,
  }

  const datasets = [playsDataset]

  return {
    labels,
    datasets,
  }
})

const chartData = computed(() => ({
  labels: formattedTimeline.value.labels,
  datasets: formattedTimeline.value.datasets,
}))

const chartOptions = computed(() => ({
  interaction: {
    intersect: false,
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
      backgroundColor: "#000",
      cornerRadius: 2,
      boxWidth: 0,
      boxHeight: 0,
      titleFont: {
        size: "16px",
      },
      bodyFont: {
        size: "14px",
      },
      callbacks: {
        title: (ctx) => {
          const label = ctx[0].label
          return isGroupedData.value ? `Week of ${label}` : label
        },
      },
    },
    datalabels: {
      display: false,
    },
    zoom: {
      zoom: {
        wheel: {
          enabled: true,
        },
        pinch: {
          enabled: true,
        },
        mode: "x",
      },
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
}))
</script>
