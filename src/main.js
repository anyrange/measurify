import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import "./assets/tailwind.css";
import VueApexCharts from "vue3-apexcharts";
import LoadingSpinner from "@/components/LoadingSpinner";
import VueKinesis from "vue-kinesis";

const app = createApp(App);

app
  .use(store)
  .use(VueApexCharts)
  .use(router)
  .use(VueKinesis)
  .mount("#app");

app.component("LoadingSpinner", LoadingSpinner);
