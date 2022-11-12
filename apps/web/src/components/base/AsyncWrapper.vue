<template>
  <template v-if="loading">
    <slot name="loading">
      <loading-spinner />
    </slot>
  </template>
  <template v-else>
    <template v-if="error">
      <error-screen :error="error" />
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
})
</script>
