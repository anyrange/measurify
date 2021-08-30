<template>
  <div class="flex flex-row w-full">
    <div class="truncate" v-for="(item, index) in routes" :key="index">
      <router-link
        class="truncate"
        :class="customClass"
        :to="{ name: name, params: { id: item.id || '' } }"
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
    name: {
      type: String,
      required: false,
      default: "artist",
    },
    customClass: {
      type: String,
      required: false,
      default: "link",
    },
  },
};
</script>
