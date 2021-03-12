import { createRouter, createWebHistory } from "vue-router";
import About from "../views/About.vue";
import Home from "../views/Home.vue";
import Playlists from "../views/Playlists.vue";
import Stats from "../views/Stats.vue";

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
        path: "playlists",
        component: Playlists,
      },
      {
        path: "stats",
        components: {
          default: Stats,
        },
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
