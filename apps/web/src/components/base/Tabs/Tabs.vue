<template>
  <ul
    id="horizontal-scrollbar"
    class="-mx-4 horizontal-scroll-wrapper w-full px-4 sm:mx-0 sm:px-0"
  >
    <slot />
  </ul>
</template>

<script setup>
import { provide, computed } from "vue"

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true,
  },
})

const emit = defineEmits(["update:modelValue"])

const active = computed(() => props.modelValue)

provide("state", {
  active: () => active.value,
})

provide("selectTab", (tab) => emit("update:modelValue", tab))
</script>

<style>
.horizontal-scroll-wrapper {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
