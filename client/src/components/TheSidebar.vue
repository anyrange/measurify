<template>
  <div>
    <a
      class="
        h-12
        px-4
        items-center
        w-full
        md:flex
        flex-row
        hidden
        gap-3
        duration-75
        text-white
        hover:bg-gray-700-spotify
        border-b
        default-border
        cursor-pointer
      "
      @click="goBack()"
    >
      <svg
        class="w-6 h-6"
        focusable="false"
        viewBox="0 0 24 24"
        aria-hidden="true"
        fill="currentColor"
      >
        <path
          d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42a.9959.9959 0 00-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z"
        ></path>
      </svg>
      <span class="text-lg font-medium">Back</span>
    </a>
    <aside class="mt-4 sidebar">
      <router-link
        v-if="isAuthenticated"
        v-wave
        class="sidebar__item"
        :to="{ name: 'profile', params: { username: user.username } }"
      >
        <account-icon class="sidebar__item__icon" />
        <span class="sidebar__item__title">Profile</span>
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
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { AccountIcon, LeaderboardIcon, FriendsIcon } from "@/components/icons";

export default {
  components: {
    AccountIcon,
    LeaderboardIcon,
    FriendsIcon,
  },
  computed: {
    ...mapState({
      user: (state) => state.auth.user,
    }),
    ...mapGetters({
      isAuthenticated: "auth/isAuthenticated",
    }),
  },
  methods: {
    goBack() {
      window.history.length > 2
        ? this.$router.go(-1)
        : this.$router.push({ name: "home" });
    },
  },
};
</script>

<style lang="postcss">
.sidebar {
  @apply flex sm:flex-col flex-row gap-2 flex-none z-50 sm:h-screen h-12 sm:px-4 p-0 sm:w-20 md:w-56 xl:w-72 w-full sm:relative fixed bottom-0 sm:inset-0 bg-gray-800-spotify;
}
.sidebar__item {
  @apply flex sm:flex-row flex-col flex-grow sm:flex-grow-0 gap-4 p-2 items-center md:justify-start sm:justify-center justify-center w-full cursor-pointer sm:rounded-md rounded-none sm:hover:text-white duration-75;
}
.sidebar__item__title {
  @apply md:flex hidden font-medium text-sm select-none;
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
.sidebar .router-link-active {
  @apply text-green-500-spotify sm:text-white bg-gray-800-spotify sm:bg-gray-700-spotify;
}
</style>
