<template>
  <div class="fullwidth">
    <ul
      class="horizontal-scroll-wrapper sm:mx-0 -mx-4 px-4 sm:px-0"
      id="horizontal-scrollbar"
    >
      <slot />
    </ul>
  </div>
</template>

<script>
export default {
  name: "Tabs",
  provide() {
    return {
      state: {
        active: () => this.active,
      },
      selectTab: (tab) => this.$emit("update:modelValue", tab),
    };
  },
  props: {
    modelValue: {
      type: [String, Number],
      required: true,
    },
  },
  emits: ["update:modelValue"],
  computed: {
    active() {
      return this.modelValue;
    },
  },
};
</script>
