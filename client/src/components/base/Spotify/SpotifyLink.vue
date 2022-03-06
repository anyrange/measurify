<template>
  <a
    :href="`https://open.spotify.com/${type}/${id}`"
    class="appearance-none"
    target="_blank"
    rel="no-referrer"
    aria-label="Open Spotify"
  >
    <icon
      class="
        block
        w-6
        h-6
        text-white
        hover:text-primary
        cursor-pointer
        duration-200
      "
      icon="fa6-brands:spotify"
    />
  </a>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});
</script>
