<template>
  <div class="absolute z-40 bottom-0 left-0 py-5 px-5 md:hidden nav-transition">
    <button
      @click="toggle"
      class="flex items-center bg-gray-700-spotify px-4 py-2 rounded text-teal-lighter focus:outline-none"
    >
      <template v-if="isOpen">
        <svg
          class="fill-current h-5 w-5 p-1"
          width="9"
          height="9"
          viewBox="0 0 9 9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Menu</title>
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M0.0383889 0.0383889C0.0895741 -0.0127963 0.172562 -0.0127963 0.223747 0.0383889L4.5 4.31464L8.77625 0.0383889C8.82744 -0.0127963 8.91043 -0.0127963 8.96161 0.0383889C9.0128 0.0895741 9.0128 0.172562 8.96161 0.223747L4.68536 4.5L8.96161 8.77625C9.0128 8.82744 9.0128 8.91043 8.96161 8.96161C8.91043 9.0128 8.82744 9.0128 8.77625 8.96161L4.5 4.68536L0.223747 8.96161C0.172562 9.0128 0.0895741 9.0128 0.0383889 8.96161C-0.0127963 8.91043 -0.0127963 8.82744 0.0383889 8.77625L4.31464 4.5L0.0383889 0.223747C-0.0127963 0.172562 -0.0127963 0.0895741 0.0383889 0.0383889Z"
          />
        </svg>
      </template>
      <template v-else>
        <svg
          class="fill-current h-5 w-5"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
      </template>
    </button>
  </div>
  <transition name="slide-fade">
    <div
      v-if="isOpen"
      class="block absolute z-30 h-screen md:flex md:flex-row md:min-h-screen relaive bg-gray-200 dark:bg-gray-900-spotify w-48 flex-none flex-col font-semibold"
    >
      <ul class="py-6">
        <h3 class="title-uppercase">
          Statistics
        </h3>

        <li>
          <router-link class="rlink sidebar-link" to="/">
            <span class="sidebar-label" @click="toggleMobile">Overview</span>
          </router-link>
        </li>
        <li>
          <router-link class="rlink sidebar-link" to="/listening-history">
            <span class="sidebar-label" @click="toggleMobile"
              >Listening History</span
            >
          </router-link>
        </li>
        <li>
          <router-link class="rlink sidebar-link" to="/playlists">
            <span class="sidebar-label" @click="toggleMobile">Playlists</span>
          </router-link>
        </li>
        <h3 class="pt-6 title-uppercase">
          Info
        </h3>
        <li>
          <router-link class="rlink sidebar-link" to="/about">
            <span class="sidebar-label" @click="toggleMobile">About</span>
          </router-link>
        </li>
        <!-- <h3 class="pt-6 title-uppercase">
          Light theme
        </h3>
        <li>
          <div class="flex items-center mx-6 mt-4 group">
            <div
              class="relative inline-block w-8 mr-2 align-middle select-none transition duration-200 ease-in outline-none"
            >
              <input
                type="checkbox"
                id="theme-toggle"
                v-model="nightMode"
                v-bind:class="{ 'bg-gray-100': nightMode }"
                class="toggle-checkbox absolute block w-4 h-4 rounded-full bg-gray-100 appearance-none cursor-pointer outline-none"
              />
              <label
                for="theme-toggle"
                v-bind:class="{ 'bg-gray-300': nightMode }"
                class="toggle-label block overflow-hidden h-4 rounded-full bg-gray-600 cursor-pointer"
              ></label>
            </div>
          </div>
        </li> -->
      </ul>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      nightMode: localStorage.getItem("nightMode") || false,
      isOpen: true,
    };
  },

  watch: {
    nightMode() {
      localStorage.setItem("nightMode", JSON.stringify(this.nightMode));
      this.checkDarkTheme();
    },
  },

  computed: {
    user() {
      return this.$store.getters.getUser;
    },
  },

  mounted() {
    this.checkDarkTheme();
    this.responsiveWindowSidebar();
  },

  methods: {
    checkDarkTheme() {
      localStorage.nightMode === "false" || !("nightMode" in localStorage)
        ? document.documentElement.classList.add("dark")
        : document.documentElement.classList.remove("dark");
    },
    logOut() {
      this.$store.commit("mutateUser", null);
      this.$router.push("/");
    },
    toggle() {
      this.isOpen = !this.isOpen;
    },
    toggleMobile() {
      if (window.innerWidth < 768) {
        this.isOpen = false;
      }
    },
    responsiveWindowSidebar() {
      window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
          this.isOpen = true;
        }
      });
    },
  },
};
</script>

<style>
.slide-fade-enter-active {
  transition: all 0.25s cubic-bezier(0, 0.4, 0.6, 1);
}
.slide-fade-leave-active {
  transition: all 0.25s cubic-bezier(1, 0.4, 0.6, 0);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-20px);
}
.toggle-checkbox:checked {
  @apply right-0 border-green-400;
  right: 0;
  border-color: #68d391;
}
.toggle-checkbox:checked + .toggle-label {
  @apply bg-green-400;
  background-color: #68d391;
}
.title-uppercase {
  @apply px-6 uppercase tracking-widest text-gray-500 font-normal text-xs;
}
.sidebar-label {
  @apply ml-2 group-hover:text-green-600-spotify;
}
.sidebar-link {
  @apply flex items-center mx-4 mt-4 group;
}
</style>
