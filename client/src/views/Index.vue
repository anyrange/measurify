<template>
  <div class="my-4 flex flex-col gap-1">
    <h1 class="h-title">
      {{ title[isAuthenticated] }}
    </h1>
    <h2 class="h-subtitle">{{ subtitle[isAuthenticated] }}</h2>
  </div>
  <suspense>
    <template v-if="isAuthenticated">
      <home-feed />
    </template>
    <template v-else>
      <home-stats />
    </template>
    <template #fallback>
      <!-- <div class="h-screen items-center justify-center">
        <loading-spinner />
      </div> -->
    </template>
  </suspense>
</template>

<script setup>
import { useAuth } from "@/composable/useAuth";

const { isAuthenticated } = useAuth();

const title = {
  true: "Feed",
  false: "Overview",
};

const subtitle = {
  true: "Your measurify feed",
  false: "Some stats about measurify",
};
</script>
