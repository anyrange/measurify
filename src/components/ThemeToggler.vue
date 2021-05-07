<template>
  <div v-if="!disabled">
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
  </div>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      nightMode: localStorage.getItem("nightMode") || false,
      desktopSidebar: true,
    };
  },
  methods: {
    checkDarkTheme() {
      localStorage.nightMode === "false" || !("nightMode" in localStorage)
        ? document.documentElement.classList.add("dark")
        : document.documentElement.classList.remove("dark");
    },
  },
  mounted() {
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

<style scoped>
.toggleSidebar-checkbox:checked {
  @apply right-0 border-green-400;
}
.toggleSidebar-checkbox:checked + .toggleSidebar-label {
  @apply bg-green-400;
}
</style>
