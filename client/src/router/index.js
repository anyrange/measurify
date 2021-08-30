import { createRouter, createWebHistory } from "vue-router";
import $store from "@/store";

const isAuthenticated = () => $store.getters["auth/isAuthenticated"];
const username = () => $store.getters["auth/getUser"].username;

const routes = [
  {
    path: "/",
    name: "login",
    component: () => import("@/views/Login.vue"),
    beforeEnter(to, from, next) {
      isAuthenticated() ? next({ name: "home" }) : next();
    },
  },
  {
    path: "/dashboard",
    name: "home",
    component: () => import("@/layouts/MainLayout.vue"),
    redirect: { name: "profile", params: { username: username() } },
    children: [
      {
        path: "/:username",
        name: "profile",
        component: () => import("@/views/Profile/Profile.vue"),
        redirect: { name: "profile-overview" },
        children: [
          {
            path: "",
            name: "profile-overview",
            component: () => import("@/views/Profile/ProfileOverview.vue"),
          },
          {
            path: "history",
            name: "profile-history",
            component: () => import("@/views/Profile/ProfileHistory.vue"),
          },
          {
            path: "reports",
            name: "profile-reports",
            component: () => import("@/views/Profile/ProfileReports.vue"),
          },
          {
            path: "library",
            name: "profile-library",
            component: () => import("@/views/Profile/ProfileLibrary.vue"),
          },
        ],
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
        path: "/leaderboard",
        name: "leaderboard",
        component: () => import("@/views/Leaderboard.vue"),
        meta: {
          title: "Listeners Leaderboard",
        },
      },
    ],
    beforeEnter(to, from, next) {
      isAuthenticated() ? next() : next({ name: "login" });
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
