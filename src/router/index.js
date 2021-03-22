import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import About from "../views/About.vue";
import PageNotFound from "../views/PageNotFound.vue";
import Overview from "../views/Overview.vue";
import Playlists from "../views/Playlists.vue";
import History from "../views/History.vue";

const routes = [
  {
    path: "/",
    redirect: "/",
    component: Home,
    meta: {
      title: "Home",
    },
    children: [
      {
        path: "/",
        name: "overview",
        component: Overview,
      },
      {
        path: "/playlists",
        component: Playlists,
        meta: {
          title: "My Playlists",
        },
      },
      {
        path: "/listening-history",
        component: History,
        meta: {
          title: "Listening History",
        },
      },
      {
        path: "/about",
        component: About,
        meta: {
          title: "About",
        },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    component: PageNotFound,
    meta: {
      title: "Page Not Found",
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
