import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";

const routes = [
  {
    path: "/",
    name: "login",
    component: () => import("@/views/Login.vue"),
    beforeEnter(to, from, next) {
      store.getters.getUser ? next({ name: "home" }) : next();
    },
  },
  {
    path: "/",
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
        name: "listening-history",
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
        path: "/:id",
        name: "profile",
        component: () => import("@/views/Profile.vue"),
        meta: {
          title: "",
        },
      },
      {
        path: "/top-listeners",
        name: "top-listeners",
        component: () => import("@/views/TopListeners.vue"),
        meta: {
          title: "Listeners Top",
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
    ],
    beforeEnter(to, from, next) {
      store.getters.getUser ? next() : next({ name: "login" });
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

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - Spotiworm` : "Spotiworm";
  next();
});

export default router;
