<template>
  <div class="fullwidth">
    <ul
      id="horizontal-scrollbar"
      class="horizontal-scroll-wrapper sm:mx-0 -mx-4 px-4 sm:px-0"
    >
      <slot />
    </ul>
  </div>
</template>

<script setup>
import { provide, computed } from "vue";

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const active = computed(() => props.modelValue);

provide("state", {
  active: () => active.value,
});

provide("selectTab", (tab) => emit("update:modelValue", tab));
</script>
