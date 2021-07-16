export default {
  data() {
    return {
      overviewData: [
        {
          name: "Plays",
          data: [],
        },
      ],
      chartOptions: {
        chart: {
          id: "chart",
          zoom: {
            autoScaleYaxis: true,
          },
          responsive: true,
          stacked: false,
          type: "area",
          toolbar: {
            show: false,
          },
          foreColor: "#373d3f",
          redrawOnWindowResize: true,
          redrawOnParentResize: true,
        },
        colors: ["#1da54d"],
        stroke: {
          show: true,
          curve: "smooth",
          lineCap: "butt",
          colors: ["#1eb252"],
          width: 1,
          dashArray: 0,
        },
        legend: {
          show: false,
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          type: "datetime",
          tickAmount: "dataPoints",
          axisBorder: {
            show: true,
            color: "#404040",
          },
          axisTicks: {
            show: false,
            color: "#404040",
          },
          tooltip: {
            enabled: false,
          },
          labels: {
            show: true,
            rotate: 0,
            rotateAlways: false,
            hideOverlappingLabels: true,
            showDuplicates: false,
            trim: false,
            minHeight: undefined,
            maxHeight: 120,
            offsetX: 0,
            offsetY: 0,
            format: "dd MMM",
          },
          categories: [],
        },
        yaxis: {
          show: true,
          axisBorder: {
            show: true,
            color: "#404040",
          },
          axisTicks: {
            show: false,
            color: "#404040",
          },
          labels: {
            show: true,
          },
          tooltip: {
            enabled: false,
          },
        },
        tooltip: {
          enabled: true,
          followCursor: true,
          x: {
            show: true,
          },
          marker: {
            show: false,
          },
        },
        grid: {
          show: false,
        },
        fill: {
          type: "gradient",
          colors: ["#1eb252"],
          gradient: {
            shade: "dark",
            type: "vertical",
            shadeIntensity: 0.4,
            gradientToColors: undefined,
            opacityFrom: 1,
            opacityTo: 0.1,
          },
        },
        noData: {
          text: "Start listening to music on Spotify and come back later!",
        },
      },
    };
  },
};
