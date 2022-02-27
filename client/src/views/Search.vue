<template>
  <div class="flex flex-col gap-1 mb-4">
    <h1 class="h-title">Search</h1>
    <h2 class="h-subtitle">We'll try to find everything you're looking for</h2>
  </div>
  <div>
    <base-input v-model.lazy="search" placeholder="Search" :debounce="400" />
  </div>
  <div class="flex gap-2"></div>
</template>

<script setup>
import { ref, watch } from "vue";

const search = ref("");

watch(search, (value) => {
  console.log(value);
});
</script>
