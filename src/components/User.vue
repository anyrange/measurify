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
        <template v-if="user.images[0]?.url">
          <img
            :src="user.images[0]?.url"
            class="object-cover w-6 h-6 rounded-full"
          />
        </template>
        <template v-else>
          <user-icon class="text-white w-6 h-6" />
        </template>
        <a href="#" class="ml-2 dark:text-white text-gray-500">
          {{ user.display_name }}</a
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
              :to="{ name: 'account' }"
            >
              Account
            </router-link>
          </div>
          <div class="py-1" role="none" @click="hover = false">
            <router-link
              class="userbar-link outline-none"
              :to="{ name: 'about' }"
            >
              About
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
import { mapGetters, mapActions } from "vuex";
import { UserIcon } from "@/components/icons";

export default {
  components: { UserIcon },
  data() {
    return {
      hover: false,
    };
  },
  computed: {
    ...mapGetters({
      user: "getUser",
    }),
  },
  methods: {
    ...mapActions({
      logout: "logout",
    }),
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
