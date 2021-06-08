import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import LoadingSpinner from "@/components/LoadingSpinner";
import { notify } from "./notify.js";
import "./registerServiceWorker";
import "./assets/tailwind.css";
import "./assets/font.css";
import "./assets/chart.css";
import "./assets/styles.css";
import ApexCharts from "apexcharts";

const app = createApp(App);

app.config.globalProperties.$apexcharts = ApexCharts;

app
  .use(store)
  .use(router)
  .use(notify)
  .mount("#app");

app.component("LoadingSpinner", LoadingSpinner);
