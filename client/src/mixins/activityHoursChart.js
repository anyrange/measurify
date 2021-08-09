export default {
  data() {
    return {
      chartOptions: {
        chart: {
          type: "polarArea",
        },
        labels: [
          "1:00",
          "2:00",
          "3:00",
          "4:00",
          "5:00",
          "6:00",
          "7:00",
          "8:00",
          "9:00",
          "10:00",
          "11:00",
          "12:00",
        ],
        fill: {},
        plotOptions: {
          polarArea: {
            rings: {
              strokeWidth: 0,
            },
            spokes: {
              strokeWidth: 1,
              connectorColors: "#282828",
            },
          },
        },
        stroke: {
          width: 1,
        },
        yaxis: {
          show: false,
        },
        legend: {
          show: false,
        },
        theme: {
          monochrome: {
            enabled: true,
            color: "#1eb252",
            shadeTo: "dark",
            shadeIntensity: 0,
          },
        },
      },
    };
  },
};
