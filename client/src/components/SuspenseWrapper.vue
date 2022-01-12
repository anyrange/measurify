<template>
  <loading-spinner v-if="loading" />
  <template v-else>
    <template v-if="error">
      <div class="h-full w-full flex items-center justify-center">
        <info-message type="error" />
      </div>
    </template>
    <template v-else>
      <slot></slot>
    </template>
  </template>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    required: true,
  },
  error: {
    type: Boolean,
    required: true,
  },
});
</script>
