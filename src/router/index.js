import { createRouter, createWebHistory } from "vue-router";
import About from "../views/About.vue";
import Home from "../views/Home.vue";
import Playlists from "../views/Playlists.vue";
import Overview from "../views/Overview.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: "Home",
    },
    children: [
      {
        path: "overview",
        components: {
          default: Overview,
        },
      },
      {
        path: "playlists",
        component: Playlists,
      },
    ],
  },
  {
    path: "/about",
    name: "About",
    component: About,
    meta: {
      title: "About",
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
