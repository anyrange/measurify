import { createRouter, createWebHistory } from "vue-router";
import $store from "@/store";

const isAuthenticated = () => $store.getters["auth/isAuthenticated"];

const routes = [
  {
    path: "/",
    name: "login",
    meta: {
      authForbidden: true,
    },
    component: () => import("@/views/Login.vue"),
  },
  {
    path: "/",
    name: "home",
    meta: {
      authRequired: true,
    },
    component: () => import("@/layouts/MainLayout.vue"),
    redirect: () => {
      return {
        name: "profile",
        params: {
          username: $store.state.auth.user.username,
        },
      };
    },
    children: [
      {
        path: "/:username",
        name: "profile",
        component: () => import("@/views/Profile/Profile.vue"),
        redirect: () => {
          return {
            name: "profile-overview",
          };
        },
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
        path: "/track/:trackId",
        name: "track",
        component: () => import("@/views/Track.vue"),
      },
      {
        path: "/artist/:artistId",
        name: "artist",
        component: () => import("@/views/Artist.vue"),
      },
      {
        path: "/album/:albumId",
        name: "album",
        component: () => import("@/views/Album.vue"),
      },
      {
        path: "/account",
        name: "account",
        meta: {
          title: "Account",
        },
        component: () => import("@/views/Account.vue"),
      },
      {
        path: "/friends",
        name: "friends",
        meta: {
          title: "Friends",
        },
        component: () => import("@/views/Friends.vue"),
      },
      {
        path: "/leaderboard",
        name: "leaderboard",
        meta: {
          title: "Listeners Leaderboard",
        },
        component: () => import("@/views/Leaderboard.vue"),
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: {
      name: "home",
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  if (to.meta.authForbidden) {
    isAuthenticated() ? next({ name: "home" }) : next();
  } else if (to.meta.authRequired) {
    isAuthenticated() ? next() : next({ name: "login" });
  } else {
    next();
  }
});

export default router;
