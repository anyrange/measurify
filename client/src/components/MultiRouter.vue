<template>
  <div class="flex flex-row w-full">
    <div class="truncate" v-for="(item, index) in routes" :key="index">
      <router-link
        class="truncate"
        :class="customClass"
        :to="{ name: 'artist', params: { artistId: item.id || '' } }"
      >
        {{ item.name }}
      </router-link>
      <span v-if="index !== routes.length - 1">,&nbsp;</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "MultiRouter",
  props: {
    routes: {
      type: Array,
      required: true,
    },
    customClass: {
      type: String,
      required: false,
      default: "link",
    },
  },
};
</script>
