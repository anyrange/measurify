<template>
  <div class="flex flex-col gap-2">
    <label
      v-if="label.length"
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
        default-focus
        disabled:opacity-40
        bg-gray-700-spotify
      "
      @input="handleInput($event.target.value)"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: false,
    default: "",
  },
  debounce: {
    type: Number,
    required: false,
    default: 0,
  },
});

const emit = defineEmits(["update:modelValue"]);

const timeout = ref(null);

const handleInput = (value) => {
  clearTimeout(timeout.value);
  timeout.value = setTimeout(() => {
    emit("update:modelValue", value);
  }, props.debounce);
};
</script>
