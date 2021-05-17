<template>
  <template v-if="!desktopSidebar">
    <div class="sidebar-mobile">
      <router-link :to="{ name: 'overview' }" class="link">
        <dashboard-icon />
      </router-link>
      <router-link :to="{ name: 'listening-history' }" class="link">
        <listening-history-icon />
      </router-link>
      <router-link :to="{ name: 'top-listeners' }" class="link">
        <listeners-top-icon />
      </router-link>
    </div>
  </template>
  <transition name="slide-fade">
    <template v-if="desktopSidebar">
      <ul class="sidebar">
        <h3 class="title-uppercase">
          Statistics
        </h3>
        <li>
          <router-link :to="{ name: 'overview' }">
            <span>Overview</span>
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'listening-history' }">
            <span>Listening History</span>
          </router-link>
        </li>
        <h3 class="title-uppercase">
          Community
        </h3>
        <li>
          <router-link :to="{ name: 'top-listeners' }">
            <span>Top Listeners</span>
          </router-link>
        </li>
        <!--
        <h3 class="title-uppercase">
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
                :class="{ 'bg-gray-100': nightMode }"
                class="toggleSidebar-checkbox absolute block w-4 h-4 rounded-full bg-gray-100 appearance-none cursor-pointer outline-none"
              />
              <label
                for="theme-toggleSidebar"
                :class="{ 'bg-gray-300': nightMode }"
                class="toggleSidebar-label block overflow-hidden h-4 rounded-full bg-gray-600 cursor-pointer"
              ></label>
            </div>
          </div>
        </li>
        -->
      </ul>
    </template>
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

<style lang="postcss" scoped>
.sidebar {
  @apply flex flex-col absolute md:relative z-40 h-screen w-48 min-w-max font-semibold dark:bg-gray-900-spotify bg-gray-200;
}
.sidebar-mobile {
  @apply flex flex-row fixed md:hidden h-12 w-full bottom-0 border-t dark:bg-gray-800-spotify dark:border-gray-600-spotify;
}
.sidebar-mobile .link {
  @apply flex flex-col flex-grow items-center justify-center overflow-hidden whitespace-nowrap text-sm transition-colors duration-100 ease-in-out text-gray-400 hover:bg-gray-700-spotify;
}
.sidebar-mobile .link.router-link-exact-active {
  @apply text-green-600-spotify;
}

.sidebar .title-uppercase {
  @apply px-6 pt-6 uppercase tracking-widest text-gray-500 font-normal text-xs;
}
.sidebar li {
  @apply flex items-center ml-6 mt-4 group;
}
.sidebar span {
  @apply hover:opacity-90;
}
.router-link-exact-active {
  @apply text-green-600-spotify;
}
.green-border {
  box-shadow: 4px 0px 0 #1db954 inset;
}
</style>
