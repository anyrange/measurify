<template>
  <div class="flex flex-col gap-2">
    <label
      v-if="label"
      :for="label"
      class="text-gray-300 text-base font-normal"
    >
      {{ label }}
    </label>
    <div>
      <div class="relative">
        <div v-if="icon" class="absolute flex top-0 left-0 h-8 w-8">
          <div
            class="
              flex
              items-center
              justify-center
              z-10
              text-gray-500-spotify text-lg
              h-full
              w-full
            "
          >
            <slot />
          </div>
        </div>
        <input
          v-bind="$attrs"
          :id="label"
          :value="modelValue"
          class="
            relative
            w-full
            px-4
            h-9
            border
            rounded
            border-gray-600-spotify
            bg-gray-700-spotify
            placeholder-gray-400
            focus:ring-2 focus:ring-opacity-50
            focus:outline-none
            disabled:opacity-40
          "
          @input="handleInput($event.target.value)"
        />
      </div>
    </div>
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
    icon: {
      type: Boolean,
      required: false,
      default: false,
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
