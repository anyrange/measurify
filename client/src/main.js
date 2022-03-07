import { createApp } from "vue";
import { createPinia } from "pinia";
import { createPersistedState } from "./piniaPersisted.js";
import App from "./App.vue";
import router from "./router";
import VWave from "v-wave";
import "virtual:windi.css";
import "./assets/styles/index.css";
import { registerSW } from "virtual:pwa-register";

registerSW({ immediate: true });

const app = createApp(App);

const pinia = createPinia();
pinia.use(createPersistedState({ modules: ["user", "settings"] }));

app.use(router).use(VWave).use(pinia).mount("#app");
