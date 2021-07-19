<template>
  <li
    v-if="visible"
    v-wave
    class="px-5 py-3 text-gray-200 text-sm rounded-md leading-4 font-medium cursor-pointer"
    :class="{
      'bg-gray-600-spotify': isActive,
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
  computed: {
    active() {
      return this.state.active();
    },
    isActive() {
      if (this.name === this.active) return true;
      return false;
    },
  },
  methods: {
    activateTab(name) {
      if (!this.disabled && name !== this.active) return this.selectTab(name);
    },
  },
};
</script>
