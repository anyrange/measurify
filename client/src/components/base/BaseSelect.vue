<template>
  <div class="flex flex-col gap-2">
    <label
      v-if="label.length"
      :for="label"
      class="font-normal text-base text-gray-300"
    >
      {{ label }}
    </label>
    <div class="relative w-full inline-block">
      <select
        :id="label"
        v-model="value"
        class="
          w-full
          h-9
          pl-2
          pr-8
          rounded
          appearance-none
          font-medium
          border border-gray-600-spotify
          hover:border-gray-500-spotify hover:border-opacity-20
          default-focus
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
      <div
        class="
          absolute
          inset-y-0
          right-0
          flex
          items-center
          px-2
          pointer-events-none
        "
      >
        <icon class="h-4 w-4" icon="ic:round-keyboard-arrow-down" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
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
});

const emit = defineEmits(["update:modelValue"]);

const value = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:modelValue", value);
  },
});
</script>
