<template>
  <div>
    <div class="flex flex-col">
      <label v-if="label" class="text-gray-300 text-base font-normal mb-2">
        {{ label }}
      </label>
      <div>
        <button
          @click="opened = !opened"
          type="button"
          ref="selector"
          class="
            relative
            w-full
            pl-3
            pr-10
            h-9
            bg-gray-700-spotify
            border border-gray-600-spotify
            rounded
            shadow-sm
            text-left
            cursor-pointer
            focus:outline-none
          "
        >
          <span class="flex items-center">
            <span class="mr-1">{{ selected }}</span>
          </span>
          <span
            class="
              ml-3
              absolute
              inset-y-0
              right-0
              flex
              items-center
              pr-2
              pointer-events-none
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              width="24px"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="h-5 w-5 text-gray-400"
            >
              <path
                d="M8.12 9.29L12 13.17l3.88-3.88c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-4.59 4.59c-.39.39-1.02.39-1.41 0L6.7 10.7c-.39-.39-.39-1.02 0-1.41.39-.38 1.03-.39 1.42 0z"
              />
            </svg>
          </span>
        </button>
        <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ul
            v-if="opened"
            class="
              absolute
              text-gray-400
              z-10
              pt-1
              flex flex-col
              mt-1
              py-1
              bg-gray-700-spotify
              shadow-lg
              max-h-56
              rounded-md
              text-sm
              focus:outline-none
            "
            :style="{ width: `${width}px` }"
          >
            <li
              v-for="(option, index) in filteredOptions"
              :key="index"
              :value="modelValue"
              @click="changeOption(option)"
            >
              <a
                class="
                  rounded
                  bg-gray-700-spotify
                  hover:bg-gray-600-spotify
                  py-2
                  px-4
                  block
                  whitespace-no-wrap
                "
                href="#"
              >
                {{ option.label }}
              </a>
            </li>
          </ul>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      opened: false,
      selected: "",
      width: "",
    };
  },
  computed: {
    filteredOptions() {
      return this.options.filter((option) => option.value != this.modelValue);
    },
  },
  mounted() {
    this.options.find((option) => {
      if (this.modelValue === option.value) {
        this.selected = option.label;
      }
    });
    this.width = this.$refs.selector.offsetWidth;
  },
  created() {
    function checkForDuplicates({ array, keyName }) {
      return new Set(array.map((item) => item[keyName])).size !== array.length;
    }
    if (checkForDuplicates({ array: this.options, keyName: "value" })) {
      console.error("Duplicate 'value' key found in :options");
    }
  },
  methods: {
    changeOption(option) {
      this.opened = false;
      this.selected = option.label;
      this.$emit("update:modelValue", option.value);
    },
    getFilteredArray() {
      return this.options.filter((option) => option.value != this.modelValue);
    },
  },
};
</script>
