import { createRouter, createWebHistory } from "vue-router";
import $store from "@/store";

const routes = [
  {
    path: "/",
    name: "login",
    component: () => import("@/views/Login.vue"),
    beforeEnter(to, from, next) {
      $store.getters.isAuthenticated ? next({ name: "home" }) : next();
    },
  },
  {
    path: "/dashboard",
    name: "home",
    component: () => import("@/layouts/MainLayout.vue"),
    redirect: { name: "overview" },
    children: [
      {
        path: "/overview",
        name: "overview",
        component: () => import("@/views/Overview.vue"),
        meta: {
          title: "Overview",
        },
      },
      {
        path: "/history",
        name: "history",
        component: () => import("@/views/History.vue"),
        meta: {
          title: "Listening History",
        },
      },
      {
        path: "/about",
        name: "about",
        component: () => import("@/views/About.vue"),
        meta: {
          title: "About",
        },
      },
      {
        path: "/@:id",
        name: "profile",
        component: () => import("@/views/Profile.vue"),
        meta: {
          title: "",
        },
      },
      {
        path: "/leaderboard",
        name: "leaderboard",
        component: () => import("@/views/Leaderboard.vue"),
        meta: {
          title: "Listeners Leaderboard",
        },
      },
      {
        path: "/account",
        name: "account",
        component: () => import("@/views/Account.vue"),
        meta: {
          title: "Account",
        },
      },
      {
        path: "/friends",
        name: "friends",
        component: () => import("@/views/Friends.vue"),
        meta: {
          title: "Friends",
        },
      },
      {
        path: "/track/:id",
        name: "track",
        component: () => import("@/views/Track.vue"),
        meta: {
          title: "",
        },
      },
      {
        path: "/artist/:id",
        name: "artist",
        component: () => import("@/views/Artist.vue"),
        meta: {
          title: "",
        },
      },
      {
        path: "/album/:id",
        name: "album",
        component: () => import("@/views/Album.vue"),
        meta: {
          title: "",
        },
      },
      {
        path: "/playlist/:id",
        name: "playlist",
        component: () => import("@/views/Playlist.vue"),
        meta: {
          title: "",
        },
      },
    ],
    beforeEnter(to, from, next) {
      $store.getters.isAuthenticated ? next() : next({ name: "login" });
    },
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

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} - Spotiworm` : "Spotiworm";
});

export default router;
