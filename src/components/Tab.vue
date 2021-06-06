<template>
  <li
    v-if="visible"
    class="px-5 py-3 text-gray-200 text-sm leading-4 font-medium cursor-pointer"
    :class="{
      'bg-gray-600-spotify rounded-md': isActive,
      'opacity-40 cursor-not-allowed': disabled,
    }"
    @click="activateTab(name)"
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
    visible: {
      type: Boolean,
      default: true,
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
    },
  },
  methods: {
    activateTab(name) {
      if (!this.disabled) return this.selectTab(name);
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
