import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue";
import About from "../views/About.vue";
import Profile from "../views/Profile.vue";
import PageNotFound from "../views/PageNotFound.vue";
import Overview from "../views/Overview.vue";
import Playlists from "../views/Playlists.vue";
import History from "../views/History.vue";

import Track from "../views/Track.vue";

const routes = [
  {
    path: "/",
    redirect: "/",
    component: MainLayout,
    meta: {
      title: "Contest Tracker",
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
        name: "about",
        meta: {
          title: "About",
        },
      },
      {
        path: "/me",
        component: Profile,
        meta: {
          title: "Profile",
        },
      },
      {
        path: "/track/:id",
        component: Track,
        name: "track",
        meta: {
          title: "...",
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

router.beforeEach((to, from, next) => {
  document.title = to.params.title ? to.params.title : to.meta.title;
  next();
});

export default router;
