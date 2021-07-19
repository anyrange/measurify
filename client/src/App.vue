<template>
  <div>
    <router-view />
    <notifications />
  </div>
</template>

<script>
import Notifications from "@/components/Notifications";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    Notifications,
  },
  data() {
    return {
      refreshing: false,
      registration: null,
    };
  },
  computed: {
    ...mapGetters({
      user: "getUser",
      isAuthenticated: "isAuthenticated",
    }),
  },
  async created() {
    const isAuthenticated = this.isAuthenticated;
    try {
      await this.updateUser();
      if (!isAuthenticated) this.$router.push({ name: "home" });
    } catch {
      this.logout();
    }
  },
  mounted() {
    document.addEventListener("swUpdated", this.showRefreshUI, { once: true });
    if (navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (this.refreshing) return;
        this.refreshing = true;
        window.location.reload();
      });
    }
  },
  methods: {
    ...mapActions(["updateUser", "logout"]),
    showRefreshUI(e) {
      this.registration = e.detail;
      if (this.user.autoUpdate) {
        this.refreshApp();
        this.$notify.show({ type: "success", message: "Updating..." });
        return;
      } else {
        this.$notify.show({
          type: "success",
          message: "Update available",
          progress: false,
          closable: false,
          actions: [
            {
              title: "Update",
              handler: () => {
                this.refreshApp();
              },
            },
          ],
        });
      }
    },
    refreshApp() {
      if (!this.registration || !this.registration.waiting) {
        return;
      }
      this.registration.waiting.postMessage("skipWaiting");
    },
  },
};
</script>
