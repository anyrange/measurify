<template>
  <div class="flex flex-col gap-2">
    <label
      v-if="label.length"
      :for="label"
      class="text-gray-300 text-base font-normal"
    >
      {{ label }}
    </label>
    <select
      :id="label"
      v-model="value"
      class="
        h-9
        px-2
        rounded
        font-medium
        border border-gray-600-spotify
        hover:border-gray-500-spotify hover:border-opacity-20
        focus:ring-2
        focus:outline-none
        disabled:opacity-40
        bg-gray-700-spotify
      "
    >
      <option
        v-for="(option, index) in options"
        :key="index"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: "BaseSelect",
  props: {
    modelValue: {
      type: [String, Number],
      required: true,
    },
    label: {
      type: String,
      required: false,
      default: "",
    },
    options: {
      type: Array,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  computed: {
    value: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
  },
};
</script>