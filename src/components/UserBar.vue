<template>
  <div class="top-bar flex items-center justify-end px-4 py-4">
    <div class="flex items-center">
      <img
        :src="this.user.images[0]?.url"
        class="object-fill w-6 h-6 rounded-full"
      />
      <a
        href="#"
        class="ml-2 hover:underline dark:text-gray-400 text-gray-500 dark:hover:text-white hover:text-gray-400"
      >
        {{ this.user.display_name }}</a
      >
      <button class="ml-4 focus:outline-none">
        <svg
          class="fill-current text-gray-400 hover:text-white w-6 h-6"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path
            class="heroicon-ui"
            d="M15.3 9.3a1 1 0 011.4 1.4l-4 4a1 1 0 01-1.4 0l-4-4a1 1 0 011.4-1.4l3.3 3.29 3.3-3.3z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
  },
};
</script>
