<template>
  <div class="flex flex-row w-full">
    <div class="truncate" v-for="(item, index) in routes" :key="index">
      <router-link
        class="link truncate"
        :to="{ name: name, params: { id: item.id } }"
      >
        {{ item.name }}
      </router-link>
      <span v-if="index !== routes.length - 1">,&nbsp;</span>
    </div>
  </div>
</template>

<script>
export default {
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
  },
};
</script>
