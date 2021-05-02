<template>
  <div @mouseleave="opened = false">
    <button
      @click="opened = !opened"
      type="button"
      class="relative w-28 bg-gray-700-spotify border border-gray-600-spotify rounded shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-gray-600 sm:text-sm"
      aria-haspopup="listbox"
      aria-expanded="true"
      aria-labelledby="listbox-label"
    >
      <span class="flex items-center">
        <span class="mr-1"> {{ selected }}</span>
      </span>
      <span
        class="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
      >
        <svg
          class="h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </span>
    </button>

    <ul
      class="w-28 absolute text-gray-700 pt-1 flex flex-col"
      :class="{ hidden: !opened }"
    >
      <li
        v-for="(option, index) of options"
        :key="index"
        :value="privacy"
        @click="
          selected = option.name;
          opened = false;
          updatePrivacy(option);
        "
      >
        <a
          class="w-full rounded bg-gray-700-spotify text-gray-500 hover:bg-gray-600-spotify py-2 px-4 block whitespace-no-wrap"
          href="#"
        >
          {{ option.name }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    privacy: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {
      opened: false,
      options: [],
      selected: this.privacy ? "Public" : "Private",
    };
  },
  methods: {
    updatePrivacy(option) {
      this.$emit("update:privacy", option.value);
      if (option.value) {
        this.options = [{ name: "Public", value: false }];
      } else {
        this.options = [{ name: "Private", value: true }];
      }
    },
  },
  mounted() {
    if (this.privacy) {
      this.options = [{ name: "Private", value: true }];
    } else {
      this.options = [{ name: "Public", value: false }];
    }
  },
};
</script>
