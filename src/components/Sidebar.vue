<template>
  <div class="absolute z-40 bottom-0 left-0 py-3 px-3 md:hidden">
    <button
      @click="toggle"
      class="flex items-center bg-gray-800-spotify px-3 py-2 border-2 rounded text-teal-lighter border-gray-700-spotify focus:outline-none"
    >
      <svg
        class="fill-current h-3 w-3"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Menu</title>
        <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
      </svg>
    </button>
  </div>
  <transition name="slide-fade">
    <div
      :class="isOpen ? 'block absolute z-30 h-screen' : 'hidden'"
      class="md:flex md:flex-row md:min-h-screen relaive bg-gray-200 dark:bg-gray-900-spotify w-48 flex-none flex-col font-semibold"
    >
      <ul class="py-6">
        <h3 class="title-uppercase">
          Statistics
        </h3>
        <li>
          <router-link class="sidebar-link" to="/">
            <span class="sidebar-label">Overview</span>
          </router-link>
        </li>
        <li>
          <router-link class="sidebar-link" to="/listening-history">
            <span class="sidebar-label">Listening History</span>
          </router-link>
        </li>
        <li>
          <router-link class="sidebar-link" to="/playlists">
            <span class="sidebar-label">Playlists</span>
          </router-link>
        </li>
        <h3 class="pt-6 title-uppercase">
          Info
        </h3>
        <li>
          <router-link class="sidebar-link" to="/about">
            <span class="sidebar-label">About</span>
          </router-link>
        </li>
        <h3 class="pt-6 title-uppercase">
          Logout
        </h3>
        <li>
          <a class="sidebar-link" href="" v-on:click="logOut()">
            <span class="sidebar-label">Logout</span>
          </a>
        </li>
        <h3 class="pt-6 title-uppercase">
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
        </li>
      </ul>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      nightMode: localStorage.getItem("nightMode") || false,
      isOpen: false,
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
    responsiveWindowSidebar() {
      window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
          this.isOpen = false;
        }
      });
    },
  },
};
</script>

<style>
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
