<template>
  <suspense-wrapper :loading="loading" :error="error">
    <div class="w-full flex flex-col gap-2 -mb-1.5">
      <div class="w-full flex flex-row items-center gap-2.5">
        <base-img
          :src="profile.user.avatar"
          :alt="profile.user.username"
          image-type="profile"
          class="flex flex-none object-cover rounded-full duration-300"
          :class="[
            isOverviewPage
              ? 'sm:w-28 sm:h-28 w-20 h-20'
              : 'sm:w-20 sm:h-20 w-16 h-16',
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
            <!--
            <div class="profile-nav-link">
              <router-link :to="{ name: 'profile-library' }">
                Library
              </router-link>
            </div> 
            -->
            <div v-if="!isUserProfile" class="profile-nav-link">
              <router-link :to="{ name: 'profile-compatibility' }">
                Compatibility
              </router-link>
            </div>
          </nav>
        </horizontal-scroll>
      </div>
    </div>
    <router-view />
  </suspense-wrapper>
</template>

<script setup>
import { useProfile } from "@/composable/useProfile";

const { profile, isUserProfile, isOverviewPage, loading, error } = useProfile();
</script>
