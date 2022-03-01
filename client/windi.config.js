import { BREAKPOINTS } from "./src/config";

export default {
  darkMode: "class",
  theme: {
    screens: BREAKPOINTS,
    extend: {
      colors: {
        "green-500-spotify": "#1ed760",
        "gray-900-spotify": "#121212",
        "gray-800-spotify": "#181818",
        "gray-700-spotify": "#282828",
        "gray-600-spotify": "#333333",
        "gray-500-spotify": "#ABABAB",
        "gray-400-spotify": "#bfbfbf",
      },
      spacing: {
        14: "3.5rem",
        22: "5.5rem",
        72: "18rem",
        200: "50rem",
        half: "50vh",
      },
      width: {
        "0.5/10": "5%",
        "1/10": "10%",
        "1.5/10": "15%",
        "2/10": "20%",
        "2.5/10": "25%",
        "3/10": "30%",
        "3.5/10": "35%",
        "4/10": "40%",
        "4.5/10": "45%",
        "7/10": "70%",
      },
      fontSize: {
        xxs: "0.5rem",
        tiny: "0.825rem",
      },
    },
  },
  variants: {
    extend: {
      opacity: ["disabled"],
      translate: ["motion-safe"],
      scale: ["active", "group-hover"],
    },
  },
  plugins: [
    require("windicss/plugin/line-clamp"),
    require("windicss/plugin/typography"),
    require("windicss/plugin/filters"),
  ],
};
