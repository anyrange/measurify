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

const app = createApp(App);

app
  .use(store)
  .use(router)
  .use(notify)
  .mount("#app");

app.component("LoadingSpinner", LoadingSpinner);
