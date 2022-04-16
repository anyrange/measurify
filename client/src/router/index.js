import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useTitle } from "@vueuse/core";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/Index.vue"),
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
    path: "/:username",
    name: "profile",
    component: () => import("@/views/Profile.vue"),
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
      {
        path: "following",
        name: "profile-following",
        component: () => import("@/views/Profile/Following.vue"),
      },
      {
        path: "followers",
        name: "profile-followers",
        component: () => import("@/views/Profile/Followers.vue"),
      },
      {
        path: "library",
        name: "profile-library",
        component: () => import("@/views/Profile/Library.vue"),
      },
      {
        path: "reports",
        name: "profile-reports",
        component: () => import("@/views/Profile/Reports.vue"),
      },
    ],
  },
  {
    path: "/account",
    name: "account",
    meta: {
      title: "Account",
      authRequired: true,
    },
    component: () => import("@/views/Account.vue"),
  },
  {
    path: "/search",
    name: "search",
    meta: {
      title: "Search",
    },
    component: () => import("@/views/Search.vue"),
  },
  {
    path: "/leaderboard",
    name: "leaderboard",
    meta: {
      title: "Listeners Leaderboard",
    },
    component: () => import("@/views/Leaderboard.vue"),
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
  if (to.meta.authRequired && !user.isAuthenticated)
    return next({ name: "home" });
  next();
  if (to.meta.title) {
    title.value = to.meta.title;
  }
});

export default router;
