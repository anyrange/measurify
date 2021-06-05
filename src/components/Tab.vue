<template>
  <li
    v-if="!disabled"
    class="px-5 py-3 text-gray-200 text-sm leading-4 font-medium cursor-pointer"
    :class="[isActive ? 'bg-gray-600-spotify rounded-md' : '']"
    @click="selectTab(name)"
  >
    <slot />
  </li>
</template>

<script>
export default {
  name: "Tab",
  inject: ["state", "selectTab"],
  props: {
    name: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: false,
    },
  },
  computed: {
    active() {
      return this.state.active();
    },
    isActive() {
      if (this.name === this.active) return true;
      return false;
    },
  },
};
</script>
