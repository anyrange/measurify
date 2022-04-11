<template>
  <container>
    <container-item>
      <div class="flex justify-between">
        <div class="flex gap-x-2">
          <base-input
            v-model.lazy="search"
            placeholder="Search"
            :debounce="400"
          />
          <base-select v-model="range" :options="RANGE_OPTIONS" />
        </div>
        <pagination
          v-if="xlAndLarger"
          v-model="page"
          :total-pages="listeningHistory.pages || 0"
        />
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
      <pagination
        class="flex justify-center"
        v-model="page"
        :total-pages="listeningHistory.pages || 0"
      />
    </container-item>
  </container>
</template>

<script setup>
import { computed, ref, inject } from "vue";
import { useTitle } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { getProfileListeningHistory } from "@/api";
import { useProfileStore } from "@/stores/profile";
import { useSettingsStore } from "@/stores/settings.js";
import { usePagination } from "@/composable/usePagination.js";
import { useBreakpoints } from "@/composable/useBreakpoints.js";
import { createAsyncProcess } from "@/composable/useAsync";
import { RANGE_OPTIONS } from "@/config";

const settingsStore = useSettingsStore();
const profileStore = useProfileStore();
const { xlAndLarger } = useBreakpoints();

const title = useTitle();
const profile = computed(() => profileStore.profile);

const contentWindow = inject("contentWindow");

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

const scrollToTop = () => {
  contentWindow.value.scroll({
    top: 0,
    left: 0,
  });
};

const { loading, run: getHistory } = createAsyncProcess(fetchHistory);

const { page, search, range, fetch } = usePagination(
  getHistory,
  listeningHistoryRange,
  scrollToTop
);

title.value = `${profile.value.user.display_name}'s listening history`;

fetch();
</script>
