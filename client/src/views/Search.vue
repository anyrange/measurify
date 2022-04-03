<template>
  <div class="my-4 flex flex-col gap-1">
    <h1 class="h-title">Search</h1>
    <h2 class="h-subtitle">We'll try to find everything you're looking for</h2>
  </div>
  <div>
    <base-input v-model.lazy="search" placeholder="Search" :debounce="400">
      <template #right>
        <loading-spinner v-if="loading" class="-mt-0.5 h-6 w-6" />
      </template>
    </base-input>
  </div>
  <div v-if="foundData && search" class="mt-4 flex flex-col gap-2">
    <div v-if="notEmpty(foundData.users)" class="flex flex-col gap-1">
      <span class="font-semibold text-lg text-white"> Users </span>
      <div class="fullwidth">
        <horizontal-scroll>
          <spotify-card
            v-for="item in foundData.users"
            :key="item.id"
            :item="{
              id: item.username,
              name: item.display_name,
              image: item.avatar,
            }"
            type="profile"
          />
        </horizontal-scroll>
      </div>
    </div>
    <div v-if="notEmpty(foundData.tracks)" class="flex flex-col gap-1">
      <span class="font-semibold text-lg text-white"> Tracks </span>
      <track-rows>
        <track-row
          v-for="(item, index) in foundData.tracks.slice(0, 5)"
          :key="index"
          :track="item"
        />
      </track-rows>
    </div>
    <div v-if="notEmpty(foundData.artists)" class="flex flex-col gap-1">
      <span class="font-semibold text-lg text-white"> Artists </span>
      <div class="fullwidth">
        <horizontal-scroll>
          <spotify-card
            v-for="item in foundData.artists"
            :key="item.id"
            :item="item"
            type="artist"
          />
        </horizontal-scroll>
      </div>
    </div>
    <div v-if="notEmpty(foundData.albums)" class="flex flex-col gap-1">
      <span class="font-semibold text-lg text-white"> Albums </span>
      <div class="fullwidth">
        <horizontal-scroll>
          <spotify-card
            v-for="item in foundData.albums"
            :key="item.id"
            :item="item"
            type="album"
          />
        </horizontal-scroll>
      </div>
    </div>
  </div>
  <template v-else>
    <span class="mt-6 text-center text-lg text-white">
      {{ loading ? "Searching..." : "Try to look for something!" }}
    </span>
  </template>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouteQuery } from "@vueuse/router";
import { doSearch } from "@/api";
import { notEmpty } from "@/utils";
import { createAsyncProcess } from "@/composable/useAsync";

const search = useRouteQuery("search", "");
const foundData = ref(null);

const { run: performSearch, loading } = createAsyncProcess(async (query) => {
  if (!query) return;
  const data = await doSearch(query);
  foundData.value = data;
});

watch(search, performSearch, {
  immediate: true,
});
</script>
