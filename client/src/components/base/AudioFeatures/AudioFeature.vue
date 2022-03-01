<template>
  <div class="w-auto flex flex-col gap-2 text-white">
    <h6 class="truncate font-normal text-sm sm:text-base">
      {{ name }}
    </h6>
    <div class="rounded-full bg-opacity-10 bg-primary">
      <div class="h-1 rounded-l-full bg-primary" :style="barStyle" />
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
