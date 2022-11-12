<template>
  <label class="flex flex-col gap-2">
    <span
      v-if="label.length"
      class="font-normal text-base text-secondary-lightest"
    >
      {{ label }}
    </span>
    <div class="relative w-full inline-block">
      <select
        :id="label"
        v-model="value"
        class="w-full h-9 pl-2 pr-8 rounded appearance-none font-medium default-focus disabled:opacity-40 bg-secondary-darker"
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
        class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"
      >
        <icon class="h-4 w-4" icon="ic:round-keyboard-arrow-down" />
      </div>
    </div>
  </label>
</template>

<script setup>
import { computed } from "vue"

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
})

const emit = defineEmits(["update:modelValue"])

const value = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:modelValue", value)
  },
})
</script>
