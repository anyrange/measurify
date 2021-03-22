export default {
  data() {
    return {
      chartOptions: {
        chart: {
          responsive: true,
          stacked: false,
          type: "area",
          toolbar: {
            show: true,
          },
          animations: {
            enabled: false,
            easing: "linear",
            speed: 100,
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
          axisBorder: {
            show: true,
            color: "#404040",
          },
          axisTicks: {
            show: true,
            color: "#404040",
          },
          tooltip: {
            enabled: false,
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
            show: true,
            color: "#404040",
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
            gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
            opacityFrom: 1,
            opacityTo: 0.1,
          },
        },
        noData: {
          text: "Loading...",
        },
      },
    };
  },
};
