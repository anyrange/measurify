<template>
  <div>
    <div
      class="
        h-12
        px-4
        md:flex
        flex-row
        hidden
        w-full
        items-center
        border-b
        default-border
        text-white
        select-none
      "
      :class="{
        'duration-75 hover:bg-gray-700-spotify cursor-pointer': showBackButton,
      }"
      @click="goBack()"
    >
      <div class="flex gap-3 items-center">
        <component
          :is="showBackButton ? 'arrow-left-icon' : 'home-icon'"
          class="w-6 h-6"
        />
        <span class="text-lg font-medium">
          {{ showBackButton ? "Back" : "Home" }}
        </span>
      </div>
    </div>
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
import {
  AccountIcon,
  LeaderboardIcon,
  FriendsIcon,
  HomeIcon,
  ArrowLeftIcon,
} from "@/components/icons";

export default {
  components: {
    AccountIcon,
    LeaderboardIcon,
    FriendsIcon,
    HomeIcon,
    ArrowLeftIcon,
  },
  computed: {
    ...mapState({
      user: (state) => state.auth.user,
      historyLength: (state) => state.app.historyLength,
    }),
    ...mapGetters({
      isAuthenticated: "auth/isAuthenticated",
    }),
    showBackButton() {
      return !(
        this.$route.name === "profile-overview" &&
        this.$route.params.username === this.user.username
      );
    },
  },
  methods: {
    goBack() {
      if (!this.showBackButton) return;
      window.history.length - this.historyLength !== 0
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
