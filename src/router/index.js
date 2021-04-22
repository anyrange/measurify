import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue";
import About from "@/views/About.vue";
import Profile from "@/views/Profile.vue";
import Overview from "@/views/Overview.vue";
import Playlists from "@/views/Playlists.vue";
import History from "@/views/History.vue";
import Track from "@/views/Track.vue";

const routes = [
  {
    path: "/",
    redirect: { name: "overview" },
    name: "home",
    component: MainLayout,
    children: [
      {
        path: "/",
        name: "overview",
        component: Overview,
      },
      {
        path: "/playlists",
        name: "playlists",
        component: Playlists,
        meta: {
          title: "My Playlists",
        },
      },
      {
        path: "/history",
        name: "listening-history",
        component: History,
        meta: {
          title: "Listening History",
        },
      },
      {
        path: "/about",
        name: "about",
        component: About,
        meta: {
          title: "About",
        },
      },
      {
        path: "/me",
        name: "profile",
        component: Profile,
        meta: {
          title: "Profile",
        },
      },
      {
        path: "/track/:id",
        name: "track",
        component: Track,
        meta: {
          title: "?",
        },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: { name: "home" },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - Spotiworm`;
  } else {
    document.title = "Spotiworm";
  }
  next();
});

export default router;
