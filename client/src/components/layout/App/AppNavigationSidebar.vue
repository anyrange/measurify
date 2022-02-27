<template>
  <aside>
    <div class="px-2 md:flex flex-row hidden text-white">
      <div class="h-12 flex items-center border-b default-border w-full">
        <base-button place="left" fullwidth @click="goBack">
          <div class="flex gap-3 items-center">
            <icon
              class="w-6 h-6"
              :icon="
                showBackButton ? 'ic:baseline-arrow-back' : 'ic:round-home'
              "
            />
            <span class="text-lg font-medium">
              {{ showBackButton ? "Back" : "Home" }}
            </span>
          </div>
        </base-button>
      </div>
    </div>
    <nav class="mt-2 sidebar" :class="[{ 'items-center': smallerThanMd }]">
      <template v-if="!userStore.isAuthenticated">
        <div class="sidebar__item">
          <base-button
            color="white"
            :fullwidth="!smallerThanMd"
            :shape="smallerThanMd ? 'circle' : 'round'"
            :loading="loading"
            @click="login"
          >
            <template v-if="smallerThanMd">
              <icon class="w-6 h-6" icon="fa6-brands:spotify" />
            </template>
            <template v-else> Log in with Spotify </template>
          </base-button>
        </div>
      </template>

      <base-link :to="{ name: 'home' }" v-wave class="sidebar__item">
        <icon class="sidebar__item__icon" icon="ic:round-home" />
        <span class="sidebar__item__title">Overview</span>
      </base-link>

      <template v-if="userStore.isAuthenticated">
        <base-link
          v-wave
          class="sidebar__item"
          :to="{
            name: 'profile',
            params: { username: userStore.user.username },
          }"
        >
          <icon class="sidebar__item__icon" icon="ic:baseline-person" />
          <span class="sidebar__item__title">Profile</span>
        </base-link>
        <!-- 
        <base-link v-wave class="sidebar__item" :to="{ name: 'account' }">
          <icon
            class="sidebar__item__icon"
            icon="ic:baseline-manage-accounts"
          />
          <span class="sidebar__item__title">Account</span>
        </base-link>
        -->
      </template>
      <base-link v-wave class="sidebar__item" :to="{ name: 'leaderboard' }">
        <icon class="sidebar__item__icon" icon="ic:round-leaderboard" />
        <span class="sidebar__item__title">Leaderboard</span>
      </base-link>
      <base-link v-wave class="sidebar__item" :to="{ name: 'search' }">
        <icon class="sidebar__item__icon" icon="ic:baseline-search" />
        <span class="sidebar__item__title">Search</span>
      </base-link>
    </nav>
  </aside>
</template>

<script setup>
import { inject, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBreakpoints } from "@vueuse/core";
import { createAsyncProcess } from "@/composable/useAsync";
import { useUserStore } from "@/stores/user";
import { redirect } from "@/api";
import { BREAKPOINTS } from "@/config";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const breakpoints = useBreakpoints(BREAKPOINTS);

const smallerThanMd = breakpoints.smaller("md");

const initialHistoryLength = inject("historyLength");

const { loading, run: login } = createAsyncProcess(redirect);

const showBackButton = computed(() => {
  return route.name && route.name !== "home";
});

const goBack = () => {
  if (!showBackButton.value) return;
  const hasHistory = window.history.length - initialHistoryLength !== 0;
  hasHistory ? router.back() : router.push({ name: "home" });
};
</script>

<style>
.sidebar {
  @apply flex sm:flex-col flex-row gap-2 flex-none z-50 sm:h-screen h-12 sm:px-2 p-0 sm:w-20 md:w-60 xl:w-60 w-full sm:relative fixed bottom-0 sm:inset-0 border-t sm:border-none border-gray-700-spotify;
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
  @apply text-white;
}
</style>
