<template>
  <div>
    <div class="flex flex-col">
      <label
        v-if="label"
        :for="label"
        class="text-gray-300 text-base font-normal mb-2"
      >
        {{ label }}
      </label>
      <div class="flex items-center group">
        <div class="relative inline-block w-12 mr-2 align-middle select-none">
          <input
            type="checkbox"
            id="toggle"
            v-bind="$attrs"
            :checked="modelValue"
            @change="handleInput($event.target.checked)"
            class="toggle absolute block w-6 h-6 rounded-full bg-gray-100 appearance-none cursor-pointer outline-none"
          />
          <label
            for="toggle"
            class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600-spotify cursor-pointer transition-colors duration-200"
          >
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Toggle",
  props: {
    modelValue: {
      type: Boolean,
      required: false,
    },
    label: {
      type: String,
      required: false,
    },
  },
  methods: {
    handleInput(value) {
      this.$emit("update:modelValue", value);
    },
  },
};
</script>

<style scoped>
.toggle:checked {
  @apply right-0 border-green-400-spotify;
}
.toggle:checked + .toggle-label {
  @apply bg-green-400-spotify;
}
</style>
