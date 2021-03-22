<template>
  <div class="static" v-if="updateExists">
    <div
      class="absolute bottom-0 right-0 w-full px-3 py-3 shadow-2xl flex flex-col items-center border-t
        sm:w-auto sm:m-4 sm:rounded-lg sm:flex-row sm:border bg-gray-700-spotify border-gray-600 text-white"
    >
      A new version of the application is available.
      <div class="flex mt-2 sm:mt-0 sm:ml-4">
        <button
          @click="refreshApp"
          class="px-3 py-2 bg-green-600-spotify hover:bg-green-700-spotify rounded-lg transition ease-in-out duration-300"
        >
          Refresh
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      refreshing: false,
      registration: null,
      updateExists: false,
    };
  },
  methods: {
    showRefreshUI(e) {
      this.registration = e.detail;
      this.updateExists = true;
    },
    refreshApp() {
      this.updateExists = false;
      if (!this.registration || !this.registration.waiting) {
        return;
      }
      this.registration.waiting.postMessage("skipWaiting");
    },
  },
  created() {
    document.addEventListener("swUpdated", this.showRefreshUI, { once: true });
    if (navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (this.refreshing) return;
        this.refreshing = true;
        window.location.reload();
      });
    }
  },
};
</script>
