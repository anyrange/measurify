<template>
  <div class="pagination">
    <button
      class="pagination-item default-focus"
      type="button"
      :disabled="isInFirstPage"
      aria-label="Go to first page"
      @click="onClickFirstPage"
    >
      <svg
        class="icon w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        enable-background="new 0 0 24 24"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <g>
          <rect fill="none" height="24" width="24" />
          <rect fill="none" height="24" width="24" />
        </g>
        <g>
          <g>
            <path
              d="M18.29,17.29L18.29,17.29c0.39-0.39,0.39-1.02,0-1.41L14.42,12l3.88-3.88c0.39-0.39,0.39-1.02,0-1.41l0,0 c-0.39-0.39-1.02-0.39-1.41,0l-4.59,4.59c-0.39,0.39-0.39,1.02,0,1.41l4.59,4.59C17.27,17.68,17.9,17.68,18.29,17.29z"
            />
            <path
              d="M11.7,17.29L11.7,17.29c0.39-0.39,0.39-1.02,0-1.41L7.83,12l3.88-3.88c0.39-0.39,0.39-1.02,0-1.41l0,0 c-0.39-0.39-1.02-0.39-1.41,0l-4.59,4.59c-0.39,0.39-0.39,1.02,0,1.41l4.59,4.59C10.68,17.68,11.31,17.68,11.7,17.29z"
            />
          </g>
        </g>
      </svg>
    </button>
    <button
      class="pagination-item default-focus"
      type="button"
      :disabled="isInFirstPage"
      aria-label="Go to previous page"
      @click="onClickPreviousPage"
    >
      <svg
        class="icon w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path
          d="M14.91 6.71c-.39-.39-1.02-.39-1.41 0L8.91 11.3c-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L11.03 12l3.88-3.88c.38-.39.38-1.03 0-1.41z"
        />
      </svg>
    </button>
    <button
      v-for="(page, index) in pages"
      :key="index"
      class="pagination-item default-focus"
      type="button"
      :disabled="page.isDisabled"
      :class="{ active: isPageActive(page.name) }"
      :aria-label="`Go to page number ${page.name}`"
      @click="onClickPage(page.name)"
    >
      {{ page.name }}
    </button>
    <button
      class="pagination-item default-focus"
      type="button"
      :disabled="isInLastPage"
      aria-label="Go to next page"
      @click="onClickNextPage"
    >
      <svg
        class="icon w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path
          d="M9.31 6.71c-.39.39-.39 1.02 0 1.41L13.19 12l-3.88 3.88c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41L10.72 6.7c-.38-.38-1.02-.38-1.41.01z"
        />
      </svg>
    </button>
    <button
      class="pagination-item default-focus"
      type="button"
      :disabled="isInLastPage"
      aria-label="Go to last page"
      @click="onClickLastPage"
    >
      <svg
        class="icon w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        enable-background="new 0 0 24 24"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <g>
          <rect fill="none" height="24" width="24" />
          <rect fill="none" height="24" width="24" />
        </g>
        <g>
          <g>
            <path
              d="M5.7,6.71L5.7,6.71c-0.39,0.39-0.39,1.02,0,1.41L9.58,12L5.7,15.88c-0.39,0.39-0.39,1.02,0,1.41l0,0 c0.39,0.39,1.02,0.39,1.41,0l4.59-4.59c0.39-0.39,0.39-1.02,0-1.41L7.12,6.71C6.73,6.32,6.09,6.32,5.7,6.71z"
            />
            <path
              d="M12.29,6.71L12.29,6.71c-0.39,0.39-0.39,1.02,0,1.41L16.17,12l-3.88,3.88c-0.39,0.39-0.39,1.02,0,1.41l0,0 c0.39,0.39,1.02,0.39,1.41,0l4.59-4.59c0.39-0.39,0.39-1.02,0-1.41l-4.59-4.59C13.32,6.32,12.68,6.32,12.29,6.71z"
            />
          </g>
        </g>
      </svg>
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
