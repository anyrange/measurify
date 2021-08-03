<template>
  <aside class="sidebar">
    <router-link
      v-wave
      class="sidebar__item sm:-mt-2 m-0"
      :to="{ name: 'account' }"
    >
      <base-img
        class="sidebar__item__avatar"
        :src="user.avatar"
        alt="profile avatar"
        avatar
      />
      <span class="sidebar__item__title sidebar__item__username">
        @{{ user.username }}
      </span>
    </router-link>
    <router-link v-wave class="sidebar__item" :to="{ name: 'overview' }">
      <dashboard-icon class="sidebar__item__icon" />
      <span class="sidebar__item__title">Overview</span>
    </router-link>
    <router-link
      v-wave
      class="sidebar__item"
      :to="{ name: 'listening-history' }"
    >
      <listening-history-icon class="sidebar__item__icon" />
      <span class="sidebar__item__title">Listening History</span>
    </router-link>
    <router-link v-wave class="sidebar__item" :to="{ name: 'leaderboard' }">
      <leaderboard-icon class="sidebar__item__icon" />
      <span class="sidebar__item__title">Leaderboard</span>
    </router-link>
    <router-link v-wave class="sidebar__item" :to="{ name: 'friends' }">
      <friends-icon class="sidebar__item__icon" />
      <span class="sidebar__item__title">Friends</span>
    </router-link>
  </aside>
</template>

<script>
import { mapGetters } from "vuex";
import {
  DashboardIcon,
  LeaderboardIcon,
  FriendsIcon,
  ListeningHistoryIcon,
} from "@/components/icons/index.js";
import BaseImg from "@/components/BaseImg.vue";

export default {
  components: {
    DashboardIcon,
    LeaderboardIcon,
    FriendsIcon,
    ListeningHistoryIcon,
    BaseImg,
  },
  computed: {
    ...mapGetters({ user: "getUser" }),
  },
};
</script>

<style lang="postcss">
.sidebar {
  @apply flex sm:flex-col z-50 flex-row flex-none sm:h-screen sm:px-2 sm:pt-8 p-0 h-12 sm:w-20 md:w-56 w-full sm:relative fixed bottom-0 sm:inset-0 gap-2 font-semibold bg-gray-900-spotify;
}
.sidebar__item {
  @apply flex sm:flex-row flex-col flex-grow sm:flex-grow-0 gap-3 p-2 items-center md:justify-start sm:justify-center justify-center w-full cursor-pointer sm:rounded-md rounded-none sm:hover:bg-gray-800-spotify;
}
.sidebar__item__title {
  @apply md:flex hidden font-medium text-sm;
}
.sidebar__item__username {
  @apply text-white text-base font-medium;
}
.sidebar__item__icon {
  @apply h-7 w-7 sm:w-8 sm:h-8 fill-current;
}
.sidebar__item__avatar {
  @apply h-7 w-7 sm:w-10 sm:h-10 rounded-full object-cover;
}
.sidebar .router-link-exact-active {
  @apply text-green-600-spotify sm:text-gray-400-spotify bg-gray-900-spotify sm:bg-gray-800-spotify;
}
</style>
