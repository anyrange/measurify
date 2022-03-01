<template>
  <template v-if="!loading">
    <container>
      <container-item>
        <container-item-label> Overall </container-item-label>
        <div class="h-full flex flex-col gap-2">
          <div>
            You have overall compatibility of
            <span class="font-semibold text-white">
              {{ compatibilityData.compatibility }}%
            </span>
            with
            <span class="font-semibold text-white">
              {{ profileStore.profile.user.username }}
            </span>
          </div>
          <div class="w-full rounded-full bg-opacity-10 bg-primary sm:w-2/5">
            <div
              class="h-1.8 rounded-l-full rounded-r-full bg-primary"
              :style="{
                width: `${Math.round(compatibilityData.compatibility)}%`,
              }"
            />
          </div>
        </div>
      </container-item>
      <container-item v-if="compatibilityData.genres.length">
        <container-item-label> Common Genres </container-item-label>
        <horizontal-scroll>
          <badge
            v-for="(genre, index) in compatibilityData.genres"
            :key="index"
          >
            {{ genre }}
          </badge>
        </horizontal-scroll>
      </container-item>
      <container-item v-if="compatibilityData.artists.length">
        <container-item-label>
          Artists Rank (Yours/Theirs)
        </container-item-label>
        <div class="flex flex-wrap gap-2">
          <template
            v-for="(item, index) in compatibilityData.artists"
            :key="index"
          >
            <rank-item type="artist" :item="item" />
          </template>
        </div>
      </container-item>
      <container-item v-if="compatibilityData.tracks.length">
        <container-item-label>
          Tracks Rank (Yours/Theirs)
        </container-item-label>
        <div class="flex flex-wrap gap-2">
          <template
            v-for="(item, index) in compatibilityData.tracks"
            :key="index"
          >
            <rank-item type="track" :item="item" />
          </template>
        </div>
      </container-item>
    </container>
  </template>
  <template v-else>
    <loading-spinner />
  </template>
</template>

<script setup>
import { ref } from "vue";
import { useProfileStore } from "@/stores/profile";
import { getProfileCompatibility } from "@/api";
import { createAsyncProcess } from "@/composable/useAsync";

const profileStore = useProfileStore();
const compatibilityData = ref(null);

const fetchCompatibility = async () => {
  compatibilityData.value = await getProfileCompatibility({
    username: profileStore.profile.user.username,
  });
};

const { run, loading } = createAsyncProcess(fetchCompatibility);

run();
</script>
