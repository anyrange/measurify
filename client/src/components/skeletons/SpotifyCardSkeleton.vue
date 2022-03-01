<template>
  <div>
    <div
      class="
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
        class="w-32 h-32 shadow-lg"
      />
      <skeleton class="w-24 h-3 rounded mt-2" />
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
