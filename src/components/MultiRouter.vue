<template>
  <template v-for="(item, index) in routes" :key="index">
    <router-link
      class="hover:underline"
      :class="[color]"
      :to="{ name: 'artist', params: { id: item.id } }"
    >
      {{ item.name }}
    </router-link>
    <span v-if="index !== routes.length - 1">,&nbsp;</span>
  </template>
</template>

<script>
export default {
  props: {
    routes: {
      type: Array,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: "text-white",
    },
  },
};
</script>
