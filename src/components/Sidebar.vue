<template>
  <div class="absolute z-40 bottom-0 left-0 py-5 px-5 md:hidden nav-transition">
    <button
      class="flex items-center align-middle w-16 h-10 focus:outline-none text-gray-500 bg-gray-700-spotify rounded text-teal-lighter"
      @click="toggle"
    >
      <span class="sr-only">Open main menu</span>
      <div
        class="w-5 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <span
          aria-hidden="true"
          class="menu-burger-item"
          :class="{ 'rotate-45': isOpen, ' -translate-y-1.5': !isOpen }"
        ></span>
        <span
          aria-hidden="true"
          class="menu-burger-item"
          :class="{ 'opacity-0': isOpen }"
        ></span>
        <span
          aria-hidden="true"
          class="menu-burger-item"
          :class="{ '-rotate-45': isOpen, ' translate-y-1.5': !isOpen }"
        ></span>
      </div>
    </button>
  </div>
  <transition name="slide-fade">
    <div v-if="isOpen" class="nav-mobile nav-desktop nav">
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

  created() {
    if (window.innerWidth < 768) {
      this.isOpen = false;
    }
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
      window.addEventListener("resize", () => {
        if (window.outerWidth < 768) {
          this.isOpen = false;
        }
      });
    },
  },
};
</script>

<style>
.menu-burger-item {
  @apply block absolute h-0.5 w-5 bg-current transform transition duration-300 ease-in-out;
}
.nav {
  @apply h-screen bg-gray-200 dark:bg-gray-900-spotify w-48 font-semibold;
}
.nav-mobile {
  @apply block absolute z-30;
}
.nav-desktop {
  @apply md:flex md:flex-row md:relative;
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
