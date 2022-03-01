<template>
  <label class="flex flex-col gap-2">
    <span
      class="font-normal text-base text-secondary-lightest"
      v-if="label.length"
    >
      {{ label }}
    </span>
    <input
      v-bind="$attrs"
      :value="modelValue"
      class="
        h-9
        px-2
        rounded
        placeholder-secondary-lighter
        default-focus
        disabled:opacity-40
        bg-secondary-darker
      "
      @input="handleInput($event.target.value)"
    />
  </label>
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
