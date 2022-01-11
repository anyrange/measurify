<template>
  <container>
    <container-item>
      <div class="flex gap-x-2">
        <base-input
          v-model.lazy="search"
          placeholder="Search"
          :debounce="400"
        />
        <base-select v-model="range" :options="rangeOptions" />
      </div>
      <track-rows>
        <div
          v-for="(item, index) in loading ? range : listeningHistory.history"
          :key="index"
        >
          <template v-if="loading">
            <div
              class="
                flex flex-row
                items-center
                duration-100
                rounded
                gap-3
                px-1
                py-1
                animate-pulse
              "
            >
              <div class="flex flex-row flex-1 truncate items-center gap-3">
                <div class="w-11 h-11 object-cover bg-gray-700-spotify" />
                <div class="flex flex-col gap-2">
                  <span class="bg-gray-600-spotify w-20 h-1.5 rounded">
                    &nbsp;
                  </span>
                  <span class="bg-gray-700-spotify w-12 h-1.5 rounded">
                    &nbsp;
                  </span>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <track-row :track="item" plays-or-date="date" />
          </template>
        </div>
      </track-rows>
      <info-message
        v-if="!loading && !listeningHistory?.history?.length && search"
        type="empty"
      />
      <div class="flex justify-center">
        <pagination v-model="page" :total-pages="listeningHistory.pages" />
      </div>
    </container-item>
  </container>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useTitle } from "@vueuse/core";
import { useHistory } from "@/composable/useProfile";
import { useProfileStore } from "@/stores/profile";
import rangeOptions from "@/assets/configs/rangeOptions.json";

const { listeningHistory, loading, range, page, search } = useHistory();
const profileStore = useProfileStore();
const title = useTitle();

const profile = computed(() => profileStore.profile);

onMounted(() => {
  title.value = profile.value
    ? `${profile.value.user.display_name}'s listening history`
    : null;
});
</script>
