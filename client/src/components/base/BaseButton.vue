<template>
  <button
    v-wave="isDisabled ? false : dense"
    type="button"
    class="base-button"
    :disabled="disabled"
    :class="buttonClass"
    v-bind="$attrs"
  >
    <template v-if="loading">
      <span class="text-center justify-center flex">
        <icon class="animate-spin" :class="spinnerClass" icon="gg:spinner" />
      </span>
    </template>
    <template v-else>
      <span class="text-center flex" :class="slotClass">
        <slot />
      </span>
    </template>
  </button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  color: {
    type: String,
    required: false,
    default: "transparent",
  },
  shape: {
    type: String,
    required: false,
    default: "default",
  },
  size: {
    type: String,
    required: false,
    default: "md",
  },
  place: {
    type: String,
    required: false,
    default: "center",
  },
  dense: {
    type: Boolean,
    required: false,
    default: true,
  },
  fullwidth: {
    type: Boolean,
    required: false,
    default: false,
  },
  loading: {
    type: Boolean,
    required: false,
  },
  disabled: {
    type: Boolean,
    required: false,
  },
});

const COLORS = {
  green: "bg-green-500-spotify text-white",
  red: "bg-red-600 text-white",
  white: "bg-white text-black",
  transparent: "bg-transparent text-gray-400-spotify",
  gray: "bg-gray-800-spotify text-gray-400-spotify",
};

const BUTTON_SIZES = {
  sm: "px-2 h-7",
  md: "px-2 h-9",
  lg: "px-2 h-11",
};

const SPINNER_SIZES = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

const PLACEMENTS = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

const SHAPES = {
  circle: {
    sm: "h-7 w-7 !px-0",
    md: "h-9 w-9 !px-0",
    lg: "h-11 w-11 !px-0",
  },
  round: "rounded-full",
  default: "rounded",
};

const isDisabled = computed(() => props.disabled || props.loading);

const createClass = (array) => array.filter((item) => item).join(" ");

const buttonClass = computed(() => {
  const shape =
    props.shape === "circle"
      ? `rounded-full ${SHAPES[props.shape][props.size]}`
      : SHAPES[props.shape];

  const width = props.fullwidth ? "w-full" : "w-auto";

  return createClass([
    COLORS[props.color],
    BUTTON_SIZES[props.size],
    shape,
    width,
  ]);
});

const slotClass = computed(() => {
  return createClass([PLACEMENTS[props.place]]);
});

const spinnerClass = computed(() => {
  return createClass([SPINNER_SIZES[props.size]]);
});
</script>

<style>
.base-button {
  @apply flex-none;
  @apply shadow-sm;
  @apply disabled:bg-opacity-20;
  @apply text-base font-medium;
  @apply transition-all duration-150 ease-linear;
  @apply outline-none default-focus;
}
</style>
