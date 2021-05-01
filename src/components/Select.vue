<template>
  <div @blur="open = false">
    <button
      class="w-28 border bg-gray-700-spotify border-gray-600-spotify  text-gray-400 focus:outline-none py-2 px-4 rounded inline-flex items-center"
      @click="open = !open"
    >
      <span class="mr-1"> {{ selected }}</span>
      <svg
        class="fill-current h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <path
          d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
        />
      </svg>
    </button>
    <ul
      class="w-28 absolute text-gray-700 pt-1 flex flex-col"
      :class="{ hidden: !open }"
    >
      <li
        v-for="(option, index) of options"
        :key="index"
        @click="
          selected = option;
          open = false;
        "
      >
        <a
          class="w-full bg-gray-700-spotify text-gray-500 hover:bg-gray-600-spotify py-2 px-4 block whitespace-no-wrap"
          :class="{
            hidden: !open,
            'rounded-b': index == options.length - 1,
            'rounded-t': index == 0,
          }"
          href="#"
        >
          {{ option }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: true,
    },
    default: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      selected: this.default
        ? this.default
        : this.options.length > 0
        ? this.options[0]
        : null,
      open: false,
    };
  },
};
</script>
