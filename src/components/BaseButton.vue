<template>
  <div>
    <button
      type="button"
      class="w-full h-auto flex flex-row items-center justify-center px-10 py-2 hover:opacity-90 disabled:opacity-20 cursor-pointer text-center text-base font-semibold transition-all duration-150 ease-linear shadow outline-none focus:outline-none"
      :disabled="disabled || loading"
      :class="[
        this.color === 'positive'
          ? 'bg-opacity-10 bg-green-500-spotify text-green-500-spotify'
          : '',
        this.color === 'negative'
          ? 'bg-opacity-10 bg-red-700 text-red-500'
          : '',
        this.color === 'white' ? 'bg-white text-black' : '',
        this.rounded ? 'rounded-full' : 'rounded-lg',
      ]"
    >
      <svg
        v-if="loading"
        class="animate-spin h-6 w-6"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <template v-else>
        <slot></slot>
      </template>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      required: false,
      default: "primary",
    },
    loading: {
      type: Boolean,
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
    },
    rounded: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>
