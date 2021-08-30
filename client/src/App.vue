<template>
  <div>
    <router-view />
    <notifications />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { notify } from "@/services/notify";
import Notifications from "@/components/Notifications";

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
      isAuthenticated: "auth/isAuthenticated",
    }),
    ...mapState({
      user: (state) => state.auth.user,
      profile: (state) => state.profile.profile,
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
        window.localStorage.clear();
        window.location.reload();
      });
    }
  },
  methods: {
    ...mapActions({
      logout: "auth/logout",
      updateUser: "auth/updateUser",
    }),
    showRefreshUI(e) {
      this.registration = e.detail;
      if (this.user.autoUpdate) {
        this.refreshApp();
        notify.show({ type: "success", message: "Updating..." });
        return;
      } else {
        notify.show({
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
