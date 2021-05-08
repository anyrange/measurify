<template>
  <div v-if="!desktopSidebar" class="mobile-sidebar">
    <router-link :to="{ name: 'overview' }" class="mobile-link">
      <dashboard-icon />
    </router-link>
    <router-link :to="{ name: 'listening-history' }" class="mobile-link">
      <listening-history-icon />
    </router-link>
    <router-link :to="{ name: 'top-listeners' }" class="mobile-link">
      <listeners-top-icon />
    </router-link>
  </div>
  <transition name="slide-fade">
    <div v-if="desktopSidebar" class="sidebar">
      <ul class="py-6">
        <h3 class="sidebar-title-uppercase">
          Statistics
        </h3>
        <li>
          <router-link class="sidebar-link" :to="{ name: 'overview' }">
            <span class="sidebar-label">Overview</span>
          </router-link>
        </li>
        <li>
          <router-link class="sidebar-link" :to="{ name: 'listening-history' }">
            <span class="sidebar-label">Listening History</span>
          </router-link>
        </li>
        <h3 class="pt-6 sidebar-title-uppercase">
          Community
        </h3>
        <li>
          <router-link class="sidebar-link" :to="{ name: 'top-listeners' }">
            <span class="sidebar-label">Top Listeners</span>
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
        </li>
        -->
      </ul>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";
import {
  ListeningHistoryIcon,
  DashboardIcon,
  ListenersTopIcon,
} from "@/components/icons";

export default {
  components: {
    ListeningHistoryIcon,
    DashboardIcon,
    ListenersTopIcon,
  },
  data() {
    return {
      desktopSidebar: true,
      nightMode: localStorage.getItem("nightMode") || false,
    };
  },
  computed: {
    ...mapGetters({
      user: "getUser",
    }),
  },
  methods: {
    checkMobile() {
      window.addEventListener("resize", () => {
        this.desktopSidebar = window.innerWidth >= 768 ? true : false;
      });
    },
    checkDarkTheme() {
      localStorage.nightMode === "false" || !("nightMode" in localStorage)
        ? document.documentElement.classList.add("dark")
        : document.documentElement.classList.remove("dark");
    },
  },
  created() {
    this.desktopSidebar = window.innerWidth <= 768 ? false : true;
  },
  mounted() {
    this.checkMobile();
    this.checkDarkTheme();
  },
  watch: {
    nightMode() {
      localStorage.setItem("nightMode", JSON.stringify(this.nightMode));
      this.checkDarkTheme();
    },
  },
};
</script>

<style lang="postcss">
.sidebar {
  @apply flex flex-row absolute md:relative h-screen w-48 min-w-max z-30 font-semibold bg-gray-200 dark:bg-gray-900-spotify;
}
.mobile-sidebar {
  @apply fixed flex z-40 bg-gray-800-spotify border-gray-600-spotify border-t w-full h-12 bottom-0 md:hidden;
}
.mobile-link {
  @apply flex flex-col flex-grow items-center justify-center overflow-hidden whitespace-nowrap text-sm transition-colors duration-100 ease-in-out text-gray-400 hover:bg-gray-700-spotify;
}
.mobile-link.router-link-exact-active {
  @apply text-green-600-spotify;
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
  @apply text-green-600-spotify;
}
.slide-fade-enter-active {
  transition: all 0.25s cubic-bezier(0, 0.4, 0.6, 1);
}
.slide-fade-leave-active {
  transition: all 0.15s cubic-bezier(1, 0.4, 0.6, 0);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-20px);
}
</style>
