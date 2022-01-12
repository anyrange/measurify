import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useTitle } from "@vueuse/core";

const routes = [
  {
    path: "/",
    name: "login",
    meta: { authForbidden: true },
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
      const userStore = useUserStore();
      return {
        name: "profile",
        params: {
          username: userStore.user.username,
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
            component: () => import("@/views/Profile/Overview.vue"),
          },
          {
            path: "history",
            name: "profile-history",
            component: () => import("@/views/Profile/History.vue"),
          },
          {
            path: "compatibility",
            name: "profile-compatibility",
            component: () => import("@/views/Profile/Compatibility.vue"),
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
  const user = useUserStore();
  const title = useTitle();
  if (to.meta.title) {
    title.value = to.meta.title;
  }
  if (to.meta.authRequired && !user.isAuthenticated)
    return next({ name: "login" });
  if (to.meta.authForbidden && user.isAuthenticated)
    return next({ name: "home" });
  next();
});

export default router;
