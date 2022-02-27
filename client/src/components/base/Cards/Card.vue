<template>
  <div
    class="
      bg-gray-700-spotify bg-opacity-50
      break-inside
      rounded-md
      w-auto
      mb-2
      p-2
    "
  >
    <div class="flex flex-row items-center gap-3">
      <span class="text-green-500-spotify text-base font-bold">
        {{ formattedTitle }}
      </span>
      <slot name="title"></slot>
    </div>
    <span class="text-white text-sm">
      <slot />
    </span>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  title: {
    type: [String, Number],
    required: true,
  },
});

const formattedTitle = computed(() =>
  typeof props.title === "number"
    ? props.title.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    : props.title
);
</script>
