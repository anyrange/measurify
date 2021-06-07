import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import LoadingSpinner from "@/components/LoadingSpinner";
import { notify } from "./notify.js";
import "./registerServiceWorker";
import "./assets/tailwind.css";
import "./assets/font.css";
import "./assets/styles.css";
import VueApexCharts from "vue3-apexcharts";
import ApexCharts from "apexcharts";

const app = createApp(App);

app.config.globalProperties.$apexcharts = ApexCharts;

app
  .use(store)
  .use(router)
  .use(VueApexCharts)
  .use(notify)
  .mount("#app");

app.component("LoadingSpinner", LoadingSpinner);
