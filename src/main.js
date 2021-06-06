import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueApexCharts from "vue3-apexcharts";
import LoadingSpinner from "@/components/LoadingSpinner";
import { notify } from "./notify.js";
import "./registerServiceWorker";
import "./assets/tailwind.css";
import "./assets/font.css";
import "./assets/styles.css";

const app = createApp(App);

app
  .use(store)
  .use(VueApexCharts)
  .use(router)
  .use(notify)
  .mount("#app");

app.component("LoadingSpinner", LoadingSpinner);
