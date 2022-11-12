import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "./App.vue"
import router from "./router"
import VWave from "v-wave"
import "virtual:windi.css"
import "./assets/styles/index.css"
import { registerSW } from "virtual:pwa-register"

registerSW({ immediate: true })

const app = createApp(App)
const pinia = createPinia()

app.use(router).use(VWave).use(pinia).mount("#app")
