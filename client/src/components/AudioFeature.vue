<template>
  <div class="flex flex-col gap-2 w-auto text-white">
    <h6 class="text-sm sm:text-base font-normal truncate">
      {{ name }}
    </h6>
    <div class="bg-opacity-10 rounded-full bg-green-500-spotify">
      <div class="h-1 rounded-l-full bg-green-500-spotify" :style="barStyle" />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
});

const barStyle = computed(() => {
  return {
    width: Math.round(props.score) + "%",
  };
});
</script>
