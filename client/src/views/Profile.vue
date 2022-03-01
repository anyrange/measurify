<template>
  <template v-if="error">
    <blankslate>
      {{ error.response.data.message }}
    </blankslate>
  </template>
  <template v-else>
    <template v-if="!loading">
      <app-bar scroll-target="infopage-title" fixed>
        <template #title>
          {{ profile.user.username }}
        </template>
        <template #right>
          <spotify-link :id="profile.user.spotifyID" type="user" />
          <template v-if="isAuthenticated && isUserProfile">
            <base-button shape="circle">
              <base-link :to="{ name: 'account' }">
                <icon
                  class="block h-7 w-7 text-white hover:cursor-pointer"
                  icon="ic:baseline-settings"
                />
              </base-link>
            </base-button>
          </template>
        </template>
      </app-bar>
      <div class="-mb-1.5 w-full flex flex-col gap-2">
        <div class="w-full flex flex-row items-center gap-2.5">
          <div
            class="relative flex flex-none duration-300"
            :class="[imageClass]"
          >
            <base-img
              :src="profile.user.avatar"
              :alt="profile.user.username"
              image-type="profile"
              class="h-full w-full rounded-full object-cover"
            />
            <template
              v-if="isAuthenticated && !isUserProfile && isOverviewPage"
            >
              <div class="absolute bottom-0 right-0">
                <base-button
                  shape="circle"
                  size="sm"
                  :aria-label="profile.followed ? 'Unfollow' : 'Follow'"
                  :loading="followProcessGoing"
                  :color="profile.followed ? 'red' : 'green'"
                  @click="toggleFollow"
                >
                  <icon
                    class="h-3 w-3"
                    :icon="
                      profile.followed ? 'akar-icons:cross' : 'akar-icons:plus'
                    "
                  />
                </base-button>
              </div>
            </template>
          </div>
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
              <h1
                class="truncate font-medium text-white text-xl sm:text-2xl"
                id="infopage-title"
              >
                {{ profile.user.display_name }}
              </h1>
              <h3 class="truncate font-light">{{ profile.user.username }}</h3>
            </div>
          </div>
        </div>
        <div class="fullwidth mb-4">
          <horizontal-scroll>
            <nav class="profile-nav">
              <div class="profile-nav-link">
                <base-link :to="{ name: 'profile-overview' }">
                  Overview
                </base-link>
              </div>
              <div class="profile-nav-link">
                <base-link :to="{ name: 'profile-history' }">
                  History
                </base-link>
              </div>
              <template v-if="isAuthenticated">
                <div
                  v-if="!isUserProfile && !profile.inactive"
                  class="profile-nav-link"
                >
                  <base-link :to="{ name: 'profile-compatibility' }">
                    Compatibility
                  </base-link>
                </div>
              </template>
              <div class="profile-nav-link">
                <base-link :to="{ name: 'profile-following' }">
                  Following
                </base-link>
              </div>
              <div class="profile-nav-link">
                <base-link :to="{ name: 'profile-followers' }">
                  Followers
                </base-link>
              </div>
            </nav>
          </horizontal-scroll>
        </div>
      </div>
      <router-view v-slot="{ Component }">
        <transition :name="route.meta.transition || 'fade'" mode="out-in">
          <keep-alive>
            <suspense>
              <template #default>
                <component
                  :is="Component"
                  :key="route.meta.usePathKey ? route.path : undefined"
                />
              </template>
              <template #fallback> Loading... </template>
            </suspense>
          </keep-alive>
        </transition>
      </router-view>
    </template>
    <template v-else>
      <loading-spinner />
    </template>
  </template>
</template>

<script setup>
import { computed, watch } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useProfileStore } from "@/stores/profile";
import { useFriendsStore } from "@/stores/friends";
import { useBreakpoints } from "@/composable/useBreakpoints";
import { createAsyncProcess } from "@/composable/useAsync";
import { useFollow } from "@/composable/useFollow";
import { useAuth } from "@/composable/useAuth";
import { getProfile } from "@/api";

const route = useRoute();
const username = computed(() => route.params.username);

const profileStore = useProfileStore();
const friendsStore = useFriendsStore();

const { xlAndLarger } = useBreakpoints();
const { isUserProfile, isAuthenticated } = useAuth();

const { profile } = storeToRefs(profileStore);

function updateProfile(data) {
  profile.value = data;
}

async function fetchProfile() {
  updateProfile(null);
  if (!username.value) return;
  const profileData = await getProfile({ username: username.value });
  updateProfile(profileData);
}

const { loading, run, error } = createAsyncProcess(fetchProfile);

watch(username, run, { immediate: true });

const { followProcessGoing, toggleFollow } = useFollow({
  following: computed(() => profile.value.followed),
  username: computed(() => profile.value.user.username),
  onUpdate: () => {
    profile.value.followed = !profile.value.followed;
    if (xlAndLarger.value) {
      friendsStore.updateFriends();
    }
  },
});

const isOverviewPage = computed(() => {
  return route.name === "profile-overview";
});

const imageClass = computed(() => {
  return isOverviewPage.value
    ? "sm:w-28 sm:h-28 w-20 h-20"
    : "sm:w-20 sm:h-20 w-16 h-16";
});
</script>

<style>
.profile-nav {
  @apply flex w-full flex-row gap-x-3  border-b-1 border-gray-800-spotify;
}
.profile-nav .profile-nav-link {
  @apply flex flex-shrink-0 flex-none hover:text-green-500-spotify;
}
.profile-nav .profile-nav-link a {
  @apply py-2 px-1;
}
.profile-nav .router-link-exact-active {
  @apply text-green-500-spotify;
  box-shadow: 0px 1px 0px #22c55e;
}
</style>
