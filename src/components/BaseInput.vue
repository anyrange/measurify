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
      <div>
        <div class="relative">
          <div
            v-if="iconLeft || iconRight"
            class="absolute flex top-0 h-full w-10"
            :class="{ 'left-0': iconLeft, 'right-0': iconRight }"
          >
            <div
              class="flex items-center justify-center z-10 text-gray-500 text-lg h-full w-full"
            >
              <slot></slot>
            </div>
          </div>
          <input
            v-bind="$attrs"
            :id="label"
            :value="modelValue"
            @input="handleInput($event.target.value)"
            class="relative w-full px-4 py-2 border rounded border-gray-600-spotify bg-gray-700-spotify placeholder-gray-400 focus:ring-2 focus:ring-opacity-50 focus:outline-none disabled:opacity-40"
            :class="{ 'pl-12': iconLeft, 'pr-12': iconRight }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CustomInput",
  props: {
    modelValue: {
      type: String,
      required: false,
    },
    label: {
      type: String,
      required: false,
    },
    iconRight: {
      type: Boolean,
      required: false,
    },
    iconLeft: {
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
