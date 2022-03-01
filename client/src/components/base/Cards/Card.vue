<template>
  <div
    class="
      bg-secondary-dark bg-opacity-50
      break-inside
      rounded-md
      w-auto
      mb-2
      p-2
    "
  >
    <div class="flex flex-row items-center gap-3">
      <span class="font-bold text-base text-primary">
        {{ formattedTitle }}
      </span>
      <slot name="title"></slot>
    </div>
    <span class="text-sm text-white">
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

<style>
.break-inside {
  break-inside: avoid;
}
</style>
