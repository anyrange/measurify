<template>
  <loading-spinner v-if="loading" />
  <template v-else>
    <info-message v-if="error" type="error" />
    <div v-else class="w-full flex flex-col gap-2">
      <div class="w-full flex flex-row items-center gap-2">
        <base-img
          :src="profile.user.avatar"
          :alt="profile.user.username"
          image-type="profile"
          class="flex flex-none object-cover rounded-full duration-300"
          :class="[
            route.name === 'profile-overview'
              ? 'sm:w-26 sm:h-26 w-20 h-20'
              : 'sm:w-18 sm:h-18 w-16 h-16',
          ]"
        />
        <div
          class="
            gap-1
            w-full
            flex flex-row flex-wrap
            sm:flex-col
            items-center
            sm:items-start
            justify-between
            sm:justify-start
          "
        >
          <div class="flex flex-col">
            <spotify-link
              :link="`https://open.spotify.com/user/${profile.user.spotifyID}`"
            >
              {{ profile.user.display_name }}
            </spotify-link>
            <h3 class="font-light truncate">@{{ profile.user.username }}</h3>
          </div>
        </div>
      </div>
      <div class="fullwidth">
        <horizontal-scroll>
          <nav class="profile-nav">
            <div class="profile-nav-link">
              <router-link :to="{ name: 'profile-overview' }">
                Overview
              </router-link>
            </div>
            <div class="profile-nav-link">
              <router-link :to="{ name: 'profile-history' }">
                History
              </router-link>
            </div>
          </nav>
        </horizontal-scroll>
      </div>
      <router-view />
    </div>
  </template>
</template>

<script setup>
import { useProfile } from "@/composable/useProfile";
import { useUserStore } from "@/stores/user";
import { useRoute } from "vue-router";

const route = useRoute();
const userStore = useUserStore();

const { profile, loading, error } = useProfile();
</script>

<style>
.profile-nav {
  @apply flex flex-row gap-x-0.5;
}
.profile-nav .profile-nav-link {
  @apply p-0.5 flex flex-shrink-0 flex-none hover:text-green-500-spotify;
}
.profile-nav .profile-nav-link a {
  @apply py-2 px-3;
}
.profile-nav .router-link-exact-active {
  @apply text-green-500-spotify border-b-2 border-green-500-spotify;
}
</style>
