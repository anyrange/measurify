import { BREAKPOINTS } from "./client/src/config";

export default {
  darkMode: "class",
  theme: {
    screens: BREAKPOINTS,
    variants: {
      extend: {
        opacity: ["disabled"],
        translate: ["motion-safe"],
        scale: ["active", "group-hover"],
      },
    },
    extend: {
      colors: {
        primary: "#1ed760",
        "secondary-darkest": "#121212",
        "secondary-darker": "#181818",
        "secondary-dark": "#282828",
        secondary: "#333333",
        "secondary-light": "#333333",
        "secondary-lighter": "#ABABAB",
        "secondary-lightest": "#BFBFBF",
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
    },
  },
  plugins: [
    require("windicss/plugin/line-clamp"),
    require("windicss/plugin/typography"),
    require("windicss/plugin/filters"),
  ],
  shortcuts: {
    "default-border": "border-secondary-dark",
    "default-focus":
      "outline-none focus:outline-none focus-visible:ring-1.5 focus:ring-inset focus:ring-secondary",
  },
};
