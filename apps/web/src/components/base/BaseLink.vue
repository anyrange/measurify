<template>
  <router-link :aria-label="to.name" :to="to" v-bind="attrs">
    <slot />
  </router-link>
</template>

<script setup>
import { useAttrs } from "vue"

defineProps({
  to: {
    type: [String, Object],
    required: true,
  },
})

const attrs = useAttrs()
</script>
