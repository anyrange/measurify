<template>
  <div class="flex items-center justify-between pt-4">
    <div class="relative flex items-center">
      <div class="absolute">
        <svg
          class="fill-current dark:text-gray-300 text-gray-400 h-4 ml-1"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path
            class="heroicon-ui"
            d="M16.32 14.9l5.39 5.4a1 1 0 01-1.42 1.4l-5.38-5.38a8 8 0 111.41-1.41zM10 16a6 6 0 100-12 6 6 0 000 12z"
          />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search"
        :disabled="disabled"
        :value="modelValue"
        @input="handleInput($event.target.value)"
        class="bg-gray-700-spotify focus:ring-2 focus:ring-opacity-50 text-gray-300 placeholder-gray-400 rounded-md sm:px-32 sm:pl-8 pl-8 py-2 outline-none"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "Search",
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: false,
    },
  },
  emits: ["update:modelValue"],
  methods: {
    handleInput(value) {
      this.$emit("update:modelValue", value);
    },
  },
};
</script>

<style></style>
