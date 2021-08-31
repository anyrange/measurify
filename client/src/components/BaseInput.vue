<template>
  <div class="flex flex-col gap-2">
    <label
      v-if="label"
      :for="label"
      class="text-gray-300 text-base font-normal"
    >
      {{ label }}
    </label>
    <input
      v-bind="$attrs"
      :id="label"
      :value="modelValue"
      class="
        h-9
        px-2
        rounded
        border border-gray-600-spotify
        hover:border-gray-500-spotify hover:border-opacity-20
        placeholder-gray-500-spotify
        focus:ring-2
        focus:outline-none
        disabled:opacity-40
        bg-gray-700-spotify
      "
      @input="handleInput($event.target.value)"
    />
  </div>
</template>

<script>
export default {
  name: "BaseInput",
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    label: {
      type: String,
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
