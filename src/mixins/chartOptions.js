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
            show: true,
            tools: {
              download: false,
              selection: false,
              zoom: true,
              zoomin: false,
              zoomout: false,
              pan: false,
              reset:
                '<svg class="chart-update-button" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.0704 2.9375C15.2568 1.125 12.7677 0 10.0035 0C4.47506 0 0.00976562 4.475 0.00976562 10C0.00976562 15.525 4.47506 20 10.0035 20C14.6689 20 18.5589 16.8125 19.6721 12.5H17.0704C16.0448 15.4125 13.2681 17.5 10.0035 17.5C5.86342 17.5 2.49882 14.1375 2.49882 10C2.49882 5.8625 5.86342 2.5 10.0035 2.5C12.0798 2.5 13.931 3.3625 15.2818 4.725L11.2543 8.75H20.0098V0L17.0704 2.9375Z" fill="#333333"/></svg>',
              customIcons: [],
            },
            autoSelected: "zoom",
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
            show: true,
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
          text: "Start listening to music on Spotify and come back later!",
        },
      },
    };
  },
};
