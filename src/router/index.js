import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import About from "@/views/About.vue";
import Profile from "@/views/Profile.vue";
import Overview from "@/views/Overview.vue";
import History from "@/views/History.vue";
import Track from "@/views/Track.vue";

import store from "@/store";

const routes = [
  {
    path: "/",
    name: "login",
    component: Login,
    beforeEnter(to, from, next) {
      if (store.getters.getUser) {
        next({
          name: "home",
        });
      } else {
        next();
      }
    },
  },
  {
    name: "home",
    component: MainLayout,
    path: "/dashboard",
    redirect: { name: "overview" },
    children: [
      {
        path: "/overview",
        name: "overview",
        component: Overview,
        meta: {
          title: "Overview",
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
    beforeEnter(to, from, next) {
      if (store.getters.getUser) {
        next();
      } else {
        next({
          name: "login",
        });
      }
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
