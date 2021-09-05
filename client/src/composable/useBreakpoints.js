import { onMounted, reactive } from "vue";

import tailwindConfig from "../../tailwind.config.js";

const getPxBreakpoint = (val) => {
  return parseFloat(val);
};

const screens = {
  sm: getPxBreakpoint(tailwindConfig.theme.screens.sm),
  md: getPxBreakpoint(tailwindConfig.theme.screens.md),
  lg: getPxBreakpoint(tailwindConfig.theme.screens.lg),
  xl: getPxBreakpoint(tailwindConfig.theme.screens.xl),
  "2xl": getPxBreakpoint(tailwindConfig.theme.screens["2xl"]),
};

const breakpoints = reactive({ w: 0, h: 0, is: "sm" });

const sm = (val) => val >= screens.sm && val < screens.md;
const md = (val) => val >= screens.md && val < screens.lg;
const lg = (val) => val >= screens.lg && val < screens.xl;
const xl = (val) => val >= screens.xl && val < screens["2xl"];
const xl2 = (val) => val >= screens["2xl"];

const getBreakpoint = (w) => {
  if (sm(w)) return "sm";
  else if (md(w)) return "md";
  else if (lg(w)) return "lg";
  else if (xl(w)) return "xl";
  else if (xl2(w)) return "2xl";
  else return "all";
};

const setBreakpoint = () => {
  breakpoints.w = window.innerWidth;
  breakpoints.h = window.innerHeight;
  breakpoints.is = getBreakpoint(window.innerWidth);
};

const useBreakpoint = () => {
  onMounted(() => {
    setBreakpoint();
    window.addEventListener("resize", () => {
      setBreakpoint();
    });
  });

  return breakpoints;
};

export default useBreakpoint;
