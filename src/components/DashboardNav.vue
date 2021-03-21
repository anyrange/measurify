<template>
  <div
    class="sidebar bg-white dark:bg-gray-900-spotify w-48 flex-none flex flex-col font-semibold"
  >
    <ul class="py-6">
      <h3
        class="px-6 uppercase tracking-widest text-gray-500 font-normal text-xs"
      >
        Statistics
      </h3>
      <li>
        <router-link class="flex items-center mx-4 mt-4 group" to="/">
          <span class="ml-2 group-hover:text-white">Overview</span>
        </router-link>
      </li>
      <li>
        <router-link
          class="flex items-center mx-4 mt-4 group"
          to="/listening-history"
        >
          <span class="ml-2 group-hover:text-white">Listening History</span>
        </router-link>
      </li>
      <li>
        <router-link class="flex items-center mx-4 mt-4 group" to="/playlists">
          <span class="ml-2 group-hover:text-white">Playlists</span>
        </router-link>
      </li>
      <h3
        class="px-6 pt-6 uppercase tracking-widest text-gray-500 font-normal text-xs"
      >
        Info
      </h3>
      <li>
        <router-link class="flex items-center mx-4 mt-4 group" to="/about">
          <span class="ml-2 group-hover:text-white">About</span>
        </router-link>
      </li>
      <h3
        class="px-6 pt-6 uppercase tracking-widest text-gray-500 font-normal text-xs"
      >
        Logout
      </h3>
      <li>
        <a
          class="flex items-center mx-4 mt-4 group"
          href=""
          v-on:click="logOut()"
        >
          <span class="ml-2 group-hover:text-white">Logout</span>
        </a>
      </li>
      <h3
        class="px-6 pt-6 uppercase tracking-widest text-gray-500 font-normal text-xs"
      >
        Light theme
      </h3>
      <li>
        <div class="flex items-center mx-4 mt-4 group">
          <div
            class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in outline-none"
          >
            <input
              type="checkbox"
              id="theme-toggle"
              v-model="nightMode"
              v-bind:class="{ 'bg-gray-100': nightMode }"
              class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-gray-100 appearance-none cursor-pointer outline-none"
            />
            <label
              for="theme-toggle"
              v-bind:class="{ 'bg-gray-300': nightMode }"
              class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"
            ></label>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nightMode: localStorage.getItem("nightMode") || false,
    };
  },
  watch: {
    nightMode: function() {
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
  },
};
</script>
<style>
.toggle-checkbox:checked {
  @apply: right-0 border-green-400;
  right: 0;
  border-color: #68d391;
}
.toggle-checkbox:checked + .toggle-label {
  @apply: bg-green-400;
  background-color: #68d391;
}
</style>
