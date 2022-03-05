<template>
  <container>
    <container-item>
      <div class="flex gap-x-2">
        <base-input
          v-model.lazy="search"
          placeholder="Search"
          :debounce="400"
        />
        <base-select v-model="range" :options="RANGE_OPTIONS" />
      </div>
      <track-rows>
        <div
          v-for="(item, index) in loading ? range : listeningHistory.history"
          :key="index"
        >
          <template v-if="loading">
            <track-row-skeleton />
          </template>
          <template v-else>
            <track-row :track="item" date />
          </template>
        </div>
      </track-rows>
      <div class="mb-4">
        <blankslate
          v-if="!loading && !listeningHistory?.history?.length"
          type="empty"
        />
      </div>
      <div class="flex justify-center">
        <pagination v-model="page" :total-pages="listeningHistory.pages" />
      </div>
    </container-item>
  </container>
</template>

<script setup>
import { computed, ref } from "vue";
import { useTitle } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { getProfileListeningHistory } from "@/api";
import { useProfileStore } from "@/stores/profile";
import { useSettingsStore } from "@/stores/settings.js";
import { usePagination } from "@/composable/usePagination.js";
import { createAsyncProcess } from "@/composable/useAsync";
import { RANGE_OPTIONS } from "@/config";

const settingsStore = useSettingsStore();
const profileStore = useProfileStore();

const title = useTitle();
const profile = computed(() => profileStore.profile);

const { listeningHistoryRange } = storeToRefs(settingsStore);

const listeningHistory = ref({
  history: [],
  pages: 0,
});

function updateHistory(data) {
  Object.assign(listeningHistory.value, data);
}

async function fetchHistory(params) {
  updateHistory({ history: null });
  try {
    const data = await getProfileListeningHistory({
      ...params,
      username: profileStore.profile.user.username,
    });
    updateHistory(data);
  } catch (error) {
    return Promise.reject(error);
  }
}

const { loading, run: getHistory } = createAsyncProcess(fetchHistory);

const { page, search, range } = usePagination(
  getHistory,
  listeningHistoryRange
);

title.value = `${profile.value.user.display_name}'s listening history`;
</script>
