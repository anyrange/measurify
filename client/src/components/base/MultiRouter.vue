<template>
  <template v-for="(item, index) in routes" :key="index">
    <base-link
      class="truncate"
      :class="customClass"
      :to="{ name: 'artist', params: { artistId: item.id || '' } }"
    >
      {{ item.name }}
    </base-link>
    <span v-if="index !== routes.length - 1">,&nbsp;</span>
  </template>
</template>

<script setup>
defineProps({
  routes: {
    type: Array,
    required: true,
  },
  customClass: {
    type: String,
    required: false,
    default: "link",
  },
});
</script>
