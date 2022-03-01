<template>
  <div class="pagination">
    <button
      class="default-focus pagination-item"
      type="button"
      :disabled="isInFirstPage"
      aria-label="Go to first page"
      @click="onClickFirstPage"
    >
      <icon class="icon h-5 w-5" icon="ic:round-keyboard-double-arrow-left" />
    </button>
    <button
      class="default-focus pagination-item"
      type="button"
      :disabled="isInFirstPage"
      aria-label="Go to previous page"
      @click="onClickPreviousPage"
    >
      <icon class="icon h-5 w-5" icon="ic:round-keyboard-arrow-left" />
    </button>
    <button
      v-for="(page, index) in pages"
      :key="index"
      class="default-focus pagination-item"
      type="button"
      :disabled="page.isDisabled"
      :class="{ active: isPageActive(page.name) }"
      :aria-label="`Go to page number ${page.name}`"
      @click="onClickPage(page.name)"
    >
      {{ page.name }}
    </button>
    <button
      class="default-focus pagination-item"
      type="button"
      :disabled="isInLastPage"
      aria-label="Go to next page"
      @click="onClickNextPage"
    >
      <icon class="icon h-5 w-5" icon="ic:round-keyboard-arrow-right" />
    </button>
    <button
      class="default-focus pagination-item"
      type="button"
      :disabled="isInLastPage"
      aria-label="Go to last page"
      @click="onClickLastPage"
    >
      <icon class="icon h-5 w-5" icon="ic:round-keyboard-double-arrow-right" />
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  maxVisibleButtons: {
    type: Number,
    required: false,
    default: 3,
  },
  totalPages: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const startPage = computed(() => {
  if (props.modelValue === 1) {
    return 1;
  }
  if (props.modelValue === props.totalPages) {
    return props.totalPages - props.maxVisibleButtons + 1;
  }
  return props.modelValue - 1;
});

const endPage = computed(() => {
  return Math.min(
    startPage.value + props.maxVisibleButtons - 1,
    props.totalPages
  );
});

const pages = computed(() => {
  const range = [];
  for (let i = startPage.value; i <= endPage.value; i += 1) {
    if (i > 0) {
      range.push({
        name: i,
        isDisabled: i === props.modelValue,
      });
    }
  }
  return range;
});

const isInFirstPage = computed(() => props.modelValue === 1);

const isInLastPage = computed(() => props.modelValue === props.totalPages);

function onClickFirstPage() {
  emit("update:modelValue", 1);
}
function onClickPreviousPage() {
  emit("update:modelValue", props.modelValue - 1);
}
function onClickPage(page) {
  emit("update:modelValue", page);
}
function onClickNextPage() {
  emit("update:modelValue", props.modelValue + 1);
}
function onClickLastPage() {
  emit("update:modelValue", props.totalPages);
}
function isPageActive(page) {
  return props.modelValue === page;
}
</script>

<style scoped>
.pagination {
  @apply flex items-center;
}
.pagination-item {
  @apply h-9 w-10 rounded flex items-center justify-center text-center hover:bg-gray-600-spotify appearance-none;
}
.active {
  @apply bg-gray-700-spotify;
}
</style>
