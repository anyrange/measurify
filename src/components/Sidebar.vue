<template>
  <div class="hambuger">
    <button class="hambuger-button" @click="toggleSidebar">
      <span class="sr-only">Open main menu</span>
      <div class="hambuger-button-container">
        <span
          aria-hidden="true"
          class="hambuger-button-item"
          :class="{
            'rotate-45': sidebarOpened,
            ' -translate-y-1.5': !sidebarOpened,
          }"
        ></span>
        <span
          aria-hidden="true"
          class="hambuger-button-item"
          :class="{ 'opacity-0': sidebarOpened }"
        ></span>
        <span
          aria-hidden="true"
          class="hambuger-button-item"
          :class="{
            '-rotate-45': sidebarOpened,
            ' translate-y-1.5': !sidebarOpened,
          }"
        ></span>
      </div>
    </button>
  </div>
  <transition name="slide-fade">
    <div v-if="sidebarOpened" class="sidebar">
      <ul class="py-6">
        <h3 class="sidebar-title-uppercase">
          Statistics
        </h3>
        <li>
          <router-link class="sidebar-link" to="/">
            <span class="sidebar-label" @click="toggleSidebarMobile"
              >Overview</span
            >
          </router-link>
        </li>
        <li>
          <router-link class="sidebar-link" to="/listening-history">
            <span class="sidebar-label" @click="toggleSidebarMobile"
              >Listening History</span
            >
          </router-link>
        </li>
        <!-- <li>
          <router-link class="sidebar-link" to="/playlists">
            <span class="sidebar-label" @click="toggleSidebarMobile"
              >Playlists</span
            >
          </router-link>
        </li> -->
        <h3 class="pt-6 sidebar-title-uppercase">
          Info
        </h3>
        <li>
          <router-link class="sidebar-link" to="/about">
            <span class="sidebar-label" @click="toggleSidebarMobile"
              >About</span
            >
          </router-link>
        </li>
        <!-- 
        <h3 class="pt-6 sidebar-title-uppercase">
          Light theme
        </h3>
        <li>
          <div class="flex items-center mx-6 mt-4 group">
            <div
              class="relative inline-block w-8 mr-2 align-middle select-none transition duration-200 ease-in outline-none"
            >
              <input
                type="checkbox"
                id="theme-toggleSidebar"
                v-model="nightMode"
                v-bind:class="{ 'bg-gray-100': nightMode }"
                class="toggleSidebar-checkbox absolute block w-4 h-4 rounded-full bg-gray-100 appearance-none cursor-pointer outline-none"
              />
              <label
                for="theme-toggleSidebar"
                v-bind:class="{ 'bg-gray-300': nightMode }"
                class="toggleSidebar-label block overflow-hidden h-4 rounded-full bg-gray-600 cursor-pointer"
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
      sidebarOpened: true,
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
  created() {
    if (window.innerWidth < 768) {
      this.sidebarOpened = false;
    }
  },
  methods: {
    checkDarkTheme() {
      localStorage.nightMode === "false" || !("nightMode" in localStorage)
        ? document.documentElement.classList.add("dark")
        : document.documentElement.classList.remove("dark");
    },
    toggleSidebar() {
      this.sidebarOpened = !this.sidebarOpened;
    },
    toggleSidebarMobile() {
      if (window.innerWidth < 768) {
        this.sidebarOpened = false;
      }
    },
    responsiveWindowSidebar() {
      window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
          this.sidebarOpened = true;
        }
        if (window.innerWidth < 768) {
          this.sidebarOpened = false;
        }
      });
    },
  },
};
</script>

<style>
.sidebar {
  @apply flex flex-row absolute md:relative h-screen w-48 min-w-max z-30 font-semibold bg-gray-200 dark:bg-gray-900-spotify;
}
.hambuger {
  @apply absolute z-40 bottom-0 left-0 py-5 px-5 md:hidden;
}
.hambuger-button {
  @apply flex items-center align-middle w-16 h-10 focus:outline-none text-gray-500 bg-gray-700-spotify rounded;
}
.hambuger-button-container {
  @apply w-5 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2;
}
.hambuger-button-item {
  @apply block absolute h-0.5 w-5 bg-current transform transition duration-300 ease-in-out;
}
.sidebar-title-uppercase {
  @apply px-6 uppercase tracking-widest text-gray-500 font-normal text-xs;
}
.sidebar-label {
  @apply ml-2 group-hover:text-green-600-spotify;
}
.sidebar-link {
  @apply flex items-center mx-4 mt-4 group;
}
.sidebar-link.router-link-exact-active {
  color: #1db954;
}
.toggleSidebar-checkbox:checked {
  @apply right-0 border-green-400;
  right: 0;
  border-color: #68d391;
}
.toggleSidebar-checkbox:checked + .toggleSidebar-label {
  @apply bg-green-400;
  background-color: #68d391;
}
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
</style>
