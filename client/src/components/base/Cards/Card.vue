<template>
  <div class="break-inside mb-2 w-auto rounded-md bg-secondary-darker p-2">
    <div class="flex flex-row items-center gap-3">
      <slot name="title">
        <span class="font-bold text-base text-primary">
          {{ formattedTitle }}
        </span>
      </slot>
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
