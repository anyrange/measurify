<template>
  <transition
    enter-active-class="updb-transition_entering updb-transition_entering_from"
    enter-to-class="updb-transition_entering_to"
    leave-active-class="updb-transition_leaving updb-transition_leaving_to"
    leave-to-class="updb-transition_leaving_to"
  >
    <div class="static" v-if="updateExists">
      <div
        class="sm:h-auto h-20 justify-center absolute bottom-0 right-0 w-full px-3 py-3 shadow-2xl flex flex-col items-center border-t
        sm:w-auto sm:m-4 sm:rounded-lg sm:flex-row sm:border bg-gray-700-spotify border-gray-600-spotify text-white"
      >
        <div class="hidden sm:block">
          A new version of the application is available
        </div>
        <div class="flex sm:mt-0 sm:ml-4">
          <button
            @click="refreshApp"
            class="px-3 py-2 bg-green-600-spotify hover:bg-green-700-spotify rounded-md transition ease-in-out duration-300"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  </transition>
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

<style>
.updb-transition_entering {
  @apply transition ease-out duration-100;
}
.updb-transition_entering_from {
  @apply transform opacity-0 -translate-x-5;
}
.updb-transition_entering_to {
  @apply transform opacity-100 scale-100;
}
.updb-transition_leaving {
  @apply transition ease-in duration-75;
}
.updb-transition_leaving_from {
  @apply transform opacity-100 scale-100;
}
.updb-transition_leaving_to {
  @apply transform opacity-0 scale-100 -translate-x-5;
}
</style>
