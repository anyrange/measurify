<template>
  <aside>
    <div class="hidden flex-row px-2 text-white md:flex">
      <div class="default-border h-12 w-full flex items-center border-b">
        <div class="px-2 font-medium text-lg text-white">spotiworm</div>
      </div>
    </div>
    <nav class="sidebar mt-2" :class="[{ 'items-center': smallerThanMd }]">
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
              <icon class="h-6 w-6" icon="fa6-brands:spotify" />
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
import { useBreakpoints } from "@/composable/useBreakpoints";
import { createAsyncProcess } from "@/composable/useAsync";
import { useAuth } from "@/composable/useAuth";
import { useUserStore } from "@/stores/user";
import { redirect } from "@/api";

const userStore = useUserStore();
const { isAuthenticated } = useAuth();
const { smallerThanMd } = useBreakpoints();

const { loading, run: login } = createAsyncProcess(redirect);
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
