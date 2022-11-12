<template>
  <div class="my-4 flex flex-col gap-1">
    <h1 class="h-title">
      {{ title[isAuthenticated] }}
    </h1>
    <h2 class="h-subtitle">{{ subtitle[isAuthenticated] }}</h2>
  </div>
  <template v-if="isAuthenticated">
    <suspense>
      <home-feed />
    </suspense>
  </template>
  <template v-else>
    <suspense>
      <home-stats />
    </suspense>
  </template>
</template>

<script setup>
import { useAuth } from "@/composable/useAuth"

const { isAuthenticated } = useAuth()

const title = {
  true: "Feed",
  false: "Overview",
}

const subtitle = {
  true: "Your measurify feed",
  false: "Some stats about measurify",
}
</script>
