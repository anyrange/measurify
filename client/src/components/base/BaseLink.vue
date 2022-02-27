<template>
  <a
    v-if="typeof to == 'string' && to.startsWith('http')"
    :href="to"
    target="_blank"
    rel="no-referrer"
    class="text-white"
    v-bind="$attrs"
  >
    <slot />
  </a>
  <router-link v-else :to="to">
    <slot />
  </router-link>
</template>

<script setup>
defineProps({
  to: {
    type: [String, Object],
    required: true,
  },
});
</script>
