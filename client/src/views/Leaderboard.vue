<template>
  <div class="flex flex-col gap-1">
    <h1 class="h-title">Leaderboard</h1>
    <h2 class="h-subtitle">
      This rating is based on the number of minutes you listen to music
    </h2>
  </div>
  <suspense-wrapper :loading="loading" :error="error">
    <div
      v-for="(item, index) in leaderboard"
      :key="item.id"
      class="flex flex-row p-2 items-center w-full bg-opacity-20 rounded-lg"
      :class="[
        isPrivateProfile(item) ? 'opacity-30' : 'opacity-100',
        item.display_name === user.display_name
          ? 'bg-gray-500-spotify'
          : 'bg-gray-600-spotify',
      ]"
    >
      <div class="flex flex-none w-10 ml-4 text-lg font-extrabold">
        <span>
          {{ index + 1 }}
        </span>
      </div>
      <div class="flex flex-row items-center">
        <div class="flex flex-col flex-none">
          <router-link
            :class="{ 'pointer-events-none': isPrivateProfile(item) }"
            :to="{ name: 'profile', params: { username: item.username } }"
          >
            <div class="relative">
              <base-img
                class="text-white object-cover w-11 h-11 rounded-full"
                image-type="profile"
                :src="item.avatar"
                :alt="item.display_name"
              />
              <lock-icon
                v-if="isPrivateProfile(item)"
                class="cursor-not-allowed inset-center"
              />
            </div>
          </router-link>
        </div>
        <div class="flex flex-col ml-4 truncate">
          <router-link
            class="text-base text-white truncate"
            :class="[
              isPrivateProfile(item)
                ? 'pointer-events-none'
                : 'hover:underline',
            ]"
            :to="{ name: 'profile', params: { username: item.username } }"
          >
            {{ item.display_name }}
          </router-link>
          <span class="text-base font-semibold text-gray-500-spotify">
            {{ item.listened }}
          </span>
        </div>
      </div>
    </div>
  </suspense-wrapper>
</template>

<script setup>
import { computed, ref } from "vue";
import { useFetch } from "@/composable/useFetch";
import { getListenersTop } from "@/api";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const user = computed(() => userStore.user);

const leaderboard = ref([]);
const { fetchData, loading, error } = useFetch();

fetchData(async () => {
  const { top } = await getListenersTop();
  leaderboard.value = top;
});

const isPrivateProfile = (item) => {
  return !item.canSee & (item.display_name != user.value.displayName);
};
</script>
