<template>
  <div class="w-auto flex flex-col gap-2 text-white">
    <span class="line-clamp-1 font-normal text-sm sm:text-base">
      {{ name }}
    </span>
    <div class="rounded-full bg-primary/10">
      <div class="h-1 rounded-l-full bg-primary" :style="barStyle" />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
})

const barStyle = computed(() => {
  return {
    width: Math.round(props.score) + "%",
  }
})
</script>
