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
      @click="goBack"
    >
      <div class="flex gap-3 items-center">
        <component
          :is="showBackButton ? ArrowLeftIcon : HomeIcon"
          class="w-6 h-6"
        />
        <span class="text-lg font-medium">
          {{ showBackButton ? "Back" : "Home" }}
        </span>
      </div>
    </div>
    <aside class="mt-4 sidebar">
      <router-link
        v-if="userStore.isAuthenticated"
        v-wave
        class="sidebar__item"
        :to="{ name: 'profile', params: { username: userStore.user.username } }"
      >
        <account-icon class="sidebar__item__icon" />
        <span class="sidebar__item__title">Profile</span>
      </router-link>
      <router-link v-wave class="sidebar__item" :to="{ name: 'account' }">
        <settings-icon class="sidebar__item__icon" />
        <span class="sidebar__item__title">Account</span>
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

<script setup>
import {
  AccountIcon,
  LeaderboardIcon,
  FriendsIcon,
  HomeIcon,
  ArrowLeftIcon,
} from "@/components/icons";
import { inject, computed } from "vue";
import { useUserStore } from "@/stores/user";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const historyLength = inject("historyLength");

const showBackButton = computed(
  () =>
    !(
      route.name === "profile-overview" &&
      route.params.username === userStore.user.username
    )
);

const goBack = () => {
  if (!showBackButton.value) return;
  window.history.length - historyLength !== 0
    ? router.go(-1)
    : router.push({ name: "home" });
};
</script>

<style>
.sidebar {
  @apply flex sm:flex-col flex-row gap-2 flex-none z-50 sm:h-screen h-12 sm:px-2 p-0 sm:w-20 md:w-60 xl:w-60 w-full sm:relative fixed bottom-0 sm:inset-0 bg-gray-800-spotify;
}
.sidebar__item {
  @apply flex sm:flex-row flex-col flex-grow sm:flex-grow-0 gap-3 p-2 items-center md:justify-start sm:justify-center justify-center w-full cursor-pointer sm:rounded rounded-none sm:hover:text-white duration-75;
}
.sidebar__item__title {
  @apply md:flex hidden font-medium text-sm select-none;
}
.sidebar__item__icon {
  @apply md:h-6 md:w-6 w-8 h-8 fill-current;
}
.sidebar .router-link-active {
  @apply text-green-500-spotify sm:text-white bg-gray-800-spotify sm:bg-gray-700-spotify;
}
</style>
