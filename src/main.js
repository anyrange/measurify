import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import "./assets/tailwind.css";
import VueApexCharts from "vue3-apexcharts";

createApp(App)
  .use(store)
  .use(VueApexCharts)
  .use(router)
  .mount("#app");
