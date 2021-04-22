<template>
  <div
    class="userbar py-3"
    @mouseleave="hover = false"
    @mouseover="hover = true"
  >
    <div
      class="px-1 py-1 relative inline-block text-left rounded-full bg-gray-900-spotify transition ease-in-out duration-75"
    >
      <div class="flex items-center">
        <template v-if="this.user.images[0]?.url">
          <img
            :src="this.user.images[0]?.url"
            class="object-cover w-6 h-6 rounded-full"
          />
        </template>
        <template v-else>
          <svg class="fill-current text-white w-6 h-6" viewBox="0 0 496 512">
            <path
              d="M248 104c-53 0-96 43-96 96s43 96 96 96 96-43 96-96-43-96-96-96zm0 144c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm0-240C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-49.7 0-95.1-18.3-130.1-48.4 14.9-23 40.4-38.6 69.6-39.5 20.8 6.4 40.6 9.6 60.5 9.6s39.7-3.1 60.5-9.6c29.2 1 54.7 16.5 69.6 39.5-35 30.1-80.4 48.4-130.1 48.4zm162.7-84.1c-24.4-31.4-62.1-51.9-105.1-51.9-10.2 0-26 9.6-57.6 9.6-31.5 0-47.4-9.6-57.6-9.6-42.9 0-80.6 20.5-105.1 51.9C61.9 339.2 48 299.2 48 256c0-110.3 89.7-200 200-200s200 89.7 200 200c0 43.2-13.9 83.2-37.3 115.9z"
            />
          </svg>
        </template>
        <a href="#" class="ml-2 dark:text-white text-gray-500">
          {{ this.user.display_name }}</a
        >
        <div class="ml-4 focus:outline-none">
          <svg
            class="arrow fill-current text-gray-400 w-6 h-6 duration-300"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path
              class="heroicon-ui"
              d="M15.3 9.3a1 1 0 011.4 1.4l-4 4a1 1 0 01-1.4 0l-4-4a1 1 0 011.4-1.4l3.3 3.29 3.3-3.3z"
            />
          </svg>
        </div>
      </div>
      <transition
        enter-active-class="transition_entering transition_entering_from"
        enter-to-class="transition_entering_to"
        leave-active-class="transition_leaving transition_leaving_to"
        leave-to-class="transition_leaving_to"
      >
        <div
          v-if="hover"
          class="z-10 bg-gray-700-spotify origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg divide-y divide-gray-600-spotify focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div class="py-1" role="none" @click="hover = false">
            <router-link
              class="userbar-link outline-none"
              :to="{ name: 'profile' }"
            >
              Account
            </router-link>
          </div>
          <div class="py-1" role="none">
            <a @click="logout()" class="userbar-link" role="menuitem"
              >Sign out</a
            >
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hover: false,
    };
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("/");
    },
  },
};
</script>

<style lang="postcss">
.userbar:hover .arrow {
  transition: all 0.1s ease-in-out;
  transform: rotate(180deg);
}
.userbar-link {
  @apply cursor-pointer block px-4 py-2 text-sm text-gray-500-spotify hover:bg-gray-600-spotify hover:text-gray-400-spotify transition ease-in-out duration-100;
}
.transition_entering {
  @apply transition ease-out duration-100;
}
.transition_entering_from {
  @apply transform opacity-0 scale-95;
}
.transition_entering_to {
  @apply transform opacity-100 scale-100;
}
.transition_leaving {
  @apply transition ease-in duration-75;
}
.transition_leaving_from {
  @apply transform opacity-100 scale-100;
}
.transition_leaving_to {
  @apply transform opacity-0 scale-95;
}
</style>
