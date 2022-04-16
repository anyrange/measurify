<template>
  <div class="flex items-center justify-between py-2">
    <div class="flex items-center">
      <span class="ml-2 w-12 font-light text-white">{{ place }}</span>

      <div class="flex items-center gap-2">
        <skeleton
          class="h-10 w-10 object-cover"
          :class="{ 'rounded-full': type !== 'albums' }"
        />
        <skeleton class="h-1.5 w-32 rounded" />
      </div>
    </div>
    <skeleton class="h-1.5 w-12 rounded" />
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    required: true,
  },
  place: {
    type: Number,
    required: true,
  },
});
</script>
