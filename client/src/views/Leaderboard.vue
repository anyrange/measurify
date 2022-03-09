<template>
  <div class="h-screen">
    <div class="my-4 flex flex-col gap-1">
      <h1 class="h-title">Leaderboard</h1>
      <h2 class="h-subtitle">
        This is just a leaderboard, you can sort it by 'minutes' or 'tracks'
      </h2>
    </div>
    <div class="mb-3 flex items-center">
      <tabs v-model="mode">
        <tab name="minutes"> Minutes </tab>
        <tab name="tracks"> Tracks </tab>
      </tabs>
    </div>
    <ul class="w-full flex flex-col divide-secondary-darker divide-y">
      <async-wrapper :error="error" :loading="loading">
        <template #loading>
          <leaderboard-item-skeleton v-for="i in 25" :key="i" :place="i" />
        </template>
        <li
          v-for="(item, index) in sortedLeaderboard"
          :key="item.id"
          class="w-full flex flex-row items-center py-3"
          :class="{
            'bg-secondary-darker rounded':
              isAuthenticated && item.display_name === user.display_name,
          }"
        >
          <span class="ml-4 w-10 flex flex-none font-extrabold text-lg">
            {{ index + 1 }}
          </span>
          <div class="w-full flex flex-row items-center">
            <div class="flex flex-none flex-col">
              <base-link
                :to="{ name: 'profile', params: { username: item.username } }"
              >
                <div class="relative">
                  <base-img
                    class="h-13 w-13 rounded-full object-cover text-white"
                    image-type="profile"
                    :src="item.avatar"
                    :alt="item.display_name"
                  />
                </div>
              </base-link>
            </div>
            <div class="fullwidth">
              <div class="ml-3 w-full flex flex-col">
                <base-link
                  class="truncate text-base text-white hover:underline"
                  :to="{ name: 'profile', params: { username: item.username } }"
                >
                  {{ item.display_name }}
                </base-link>
                <span class="font-semibold text-base text-secondary-lighter">
                  {{
                    mode === "minutes"
                      ? item.listened.time
                      : item.listened.count
                  }}
                </span>
              </div>
            </div>
          </div>
        </li>
      </async-wrapper>
    </ul>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { getListenersTop } from "@/api";
import { useUserStore } from "@/stores/user";
import { createAsyncProcess } from "@/composable/useAsync";
import { useAuth } from "@/composable/useAuth";

const { isAuthenticated } = useAuth();

const userStore = useUserStore();

const user = computed(() => userStore.user);

const leaderboard = ref([]);
const mode = ref("minutes");

const sortedLeaderboard = computed(() => {
  const newArray = leaderboard.value;
  const sorted = newArray.sort((a, b) => {
    if (mode.value === "minutes") {
      return b.listened.time - a.listened.time;
    }
    return b.listened.count - a.listened.count;
  });
  return sorted;
});

const fetchLeaderboard = async () => {
  leaderboard.value = await getListenersTop();
};

const { run, loading, error } = createAsyncProcess(fetchLeaderboard);

run();
</script>
