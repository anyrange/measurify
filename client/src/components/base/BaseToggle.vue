<template>
  <div class="flex flex-col">
    <label
      v-if="label"
      :for="label"
      class="mb-2 font-normal text-base text-gray-300"
    >
      {{ label }}
    </label>
    <div class="group flex items-center">
      <div class="relative mr-2 w-12 inline-block select-none align-middle">
        <input
          id="toggle"
          type="checkbox"
          v-bind="$attrs"
          :checked="modelValue"
          class="
            toggle
            absolute
            block
            w-6
            h-6
            rounded-full
            bg-gray-100
            appearance-none
            cursor-pointer
            outline-none
          "
          @change="handleInput($event.target.checked)"
        />
        <label
          for="toggle"
          class="
            toggle-label
            block
            overflow-hidden
            h-6
            rounded-full
            bg-gray-600-spotify
            cursor-pointer
            transition-colors
            duration-200
          "
        />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    required: false,
  },
  label: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const handleInput = (value) => {
  emit("update:modelValue", value);
};
</script>

<style scoped>
.toggle:checked {
  @apply right-0 border-green-500-spotify;
}
.toggle:checked + .toggle-label {
  @apply bg-green-500-spotify;
}
</style>
