<template>
  <div class="sidebar">
    <router-link class="sidebar__item" :to="{ name: 'account' }">
      <base-img
        class="sidebar__item__avatar"
        avatar
        :src="user.avatar"
        alt="profile avatar"
      />
      <span class="sidebar__item__title sidebar__item__username">
        @{{ user.username }}
      </span>
    </router-link>
    <router-link class="sidebar__item" :to="{ name: 'overview' }">
      <dashboard-icon class="sidebar__item__icon" />
      <span class="sidebar__item__title">Overview</span>
    </router-link>
    <router-link class="sidebar__item" :to="{ name: 'listening-history' }">
      <listening-history-icon class="sidebar__item__icon" />
      <span class="sidebar__item__title">Listening History</span>
    </router-link>
    <router-link class="sidebar__item" :to="{ name: 'top-listeners' }">
      <listeners-top-icon class="sidebar__item__icon" />
      <span class="sidebar__item__title">Top Listeners</span>
    </router-link>
    <router-link class="sidebar__item" :to="{ name: 'friends' }">
      <friends-icon class="sidebar__item__icon" />
      <span class="sidebar__item__title">Friends</span>
    </router-link>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  ListeningHistoryIcon,
  DashboardIcon,
  ListenersTopIcon,
  FriendsIcon,
} from "@/components/icons";
import BaseImg from "@/components/BaseImg.vue";

export default {
  components: {
    ListeningHistoryIcon,
    DashboardIcon,
    ListenersTopIcon,
    FriendsIcon,
    BaseImg,
  },
  computed: {
    ...mapGetters({ user: "getUser" }),
  },
};
</script>

<style lang="postcss">
.sidebar {
  @apply flex sm:flex-col flex-row flex-none sm:h-screen sm:px-2 sm:pt-8 p-0 h-12 sm:w-20 md:w-56 w-full sm:relative fixed bottom-0 sm:inset-0 gap-2 font-semibold bg-gray-900-spotify;
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
  @apply w-8 h-8 flex fill-current;
}
.sidebar .router-link-exact-active {
  @apply text-green-600-spotify sm:text-gray-400-spotify bg-gray-900-spotify sm:bg-gray-800-spotify;
}
.sidebar__item__avatar {
  @apply w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover;
}
</style>
