<template>
  <aside>
    <div class="hidden flex-row px-2 text-white md:flex">
      <div class="default-border h-12 w-full flex items-center border-b">
        <div class="px-2 font-medium text-lg text-white">spotiworm</div>
      </div>
    </div>
    <nav class="sidebar mt-2" :class="[{ 'items-center': smallerThanMd }]">
      <template v-if="!isAuthenticated">
        <div class="sidebar__item">
          <base-button
            :color="smallerThanMd ? 'transparent' : 'white'"
            :shape="smallerThanMd ? 'circle' : 'round'"
            :fullwidth="!smallerThanMd"
            @click="redirect"
          >
            <template v-if="smallerThanMd">
              <icon
                class="block h-6 w-6 text-white"
                icon="fa6-brands:spotify"
              />
            </template>
            <template v-else> Log in with Spotify </template>
          </base-button>
        </div>
      </template>
      <base-link :to="{ name: 'home' }" v-wave class="sidebar__item">
        <icon class="sidebar__item__icon" icon="ic:round-home" />
        <span class="sidebar__item__title">Overview</span>
      </base-link>
      <template v-if="isAuthenticated">
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
import { useBreakpoints } from "@/composable/useBreakpoints";
import { useAuth } from "@/composable/useAuth";
import { useUserStore } from "@/stores/user";
import { redirect } from "@/api";

const { isAuthenticated } = useAuth();
const { smallerThanMd } = useBreakpoints();
const userStore = useUserStore();
</script>

<style>
.sidebar {
  @apply sm:bg-secondary-darker bg-secondary-darkest z-50;
  @apply flex flex-row sm:flex-col gap-2 flex-none;
  @apply sm:h-screen h-12 sm:px-2 p-0;
  @apply sm:w-20 md:w-60 xl:w-60 w-full;
  @apply sm:relative fixed bottom-0 sm:inset-0;
  @apply border-t sm:border-none border-secondary-dark;
}
.sidebar__item {
  @apply flex sm:flex-row flex-col flex-grow sm:flex-grow-0 gap-3 p-2 w-full;
  @apply items-center md:justify-start sm:justify-center justify-center;
  @apply cursor-pointer sm:rounded rounded-none sm:hover:text-white duration-75;
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
