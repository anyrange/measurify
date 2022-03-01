<template>
  <div>
    <div
      class="
        h-52
        bg-gray-700-spotify bg-opacity-20
        hover:bg-opacity-60
        flex flex-shrink-0 flex-none flex-col
        items-center
        duration-200
        rounded-md
        gap-3
        p-3
        group
        relative
      "
    >
      <skeleton
        :class="[
          type === 'artist' || 'profile' ? 'rounded-full' : 'rounded-md',
        ]"
        class="h-32 w-32 shadow-lg"
      />
      <skeleton class="mt-2 h-3 w-24 rounded" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    required: true,
  },
});
</script>
