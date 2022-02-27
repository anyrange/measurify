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
      <div
        :class="[
          type === 'artist' || 'profile' ? 'rounded-full' : 'rounded-md',
        ]"
        class="w-32 h-32 object-cover shadow-lg bg-gray-800-spotify"
      >
        &nbsp;
      </div>
      <span class="bg-gray-600-spotify w-24 h-2 rounded mt-1.8"> &nbsp; </span>
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
