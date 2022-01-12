<template>
  <suspense-wrapper :loading="loading" :error="error">
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
          <div
            class="
              bg-opacity-10
              w-full
              sm:w-2/5
              rounded-full
              bg-green-500-spotify
            "
          >
            <div
              class="h-1.8 rounded-l-full bg-green-500-spotify rounded-r-full"
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
        <div class="flex gap-2 flex-wrap">
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
        <div class="flex gap-2 flex-wrap">
          <template
            v-for="(item, index) in compatibilityData.tracks"
            :key="index"
          >
            <rank-item type="track" :item="item" />
          </template>
        </div>
      </container-item>
    </container>
  </suspense-wrapper>
</template>

<script setup>
import { useCompatibility } from "@/composable/useProfile";
import { useProfileStore } from "@/stores/profile";

const profileStore = useProfileStore();

const { compatibilityData, loading, error } = useCompatibility();
</script>
