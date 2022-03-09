<template>
  <div class="h-screen flex items-center justify-center">
    <div class="flex flex-col items-center justify-center text-white">
      <icon class="h-16 w-16" icon="ic:outline-error-outline" />
      <span class="font-bold text-2xl"> Ooops. Something went wrong </span>
      <span class="font-medium text-base">
        <slot>
          {{ error.response.status }} -
          {{ error.response.data.message }}
        </slot>
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  error: {
    type: Object,
    required: false,
    default: null,
  },
});
</script>
