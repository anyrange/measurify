<template>
  <div class="flex flex-col gap-1 my-4">
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
  <ul class="flex flex-col w-full divide-gray-800-spotify divide-y">
    <template v-if="!loading">
      <li v-for="(item, index) in sortedLeaderboard" :key="item.id">
        <div
          class="w-full py-3 flex flex-row items-center"
          :class="{
            'bg-gray-700-spotify rounded bg-opacity-70':
              isAuthenticated && item.display_name === user.display_name,
          }"
        >
          <span class="flex flex-none w-10 ml-4 text-lg font-extrabold">
            {{ index + 1 }}
          </span>
          <div class="flex flex-row items-center">
            <div class="flex flex-col flex-none">
              <base-link
                :to="{ name: 'profile', params: { username: item.username } }"
              >
                <div class="relative">
                  <base-img
                    class="text-white object-cover w-13 h-13 rounded-full"
                    image-type="profile"
                    :src="item.avatar"
                    :alt="item.display_name"
                  />
                </div>
              </base-link>
            </div>
            <div class="flex flex-col ml-3 truncate">
              <base-link
                class="text-base text-white truncate hover:underline"
                :to="{ name: 'profile', params: { username: item.username } }"
              >
                {{ item.display_name }}
              </base-link>
              <span class="text-base font-semibold text-gray-500-spotify">
                {{
                  mode === "minutes" ? item.listened.time : item.listened.count
                }}
              </span>
            </div>
          </div>
        </div>
      </li>
    </template>
    <template v-else>
      <leaderboard-item-skeleton v-for="i in 25" :key="i" :place="i" />
    </template>
  </ul>
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

const { run, loading } = createAsyncProcess(fetchLeaderboard);

run();
</script>
