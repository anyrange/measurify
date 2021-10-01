<template>
  <div>
    <router-view />
    <notifications />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState, mapMutations } from "vuex";
import { notify } from "@/services/notify.js";
import Notifications from "@/components/Notifications.vue";

export default {
  components: {
    Notifications,
  },
  data() {
    return {
      updateSW: undefined,
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
    this.saveHistoryLength(window.history.length);
    const isAuthenticated = this.isAuthenticated;
    try {
      await this.updateUser();
      if (!isAuthenticated) this.$router.push({ name: "home" });
    } catch {
      this.logout();
    }
  },
  async mounted() {
    try {
      const { registerSW } = await import("virtual:pwa-register");
      const vm = this;
      this.updateSW = registerSW({
        immediate: true,
        onNeedRefresh() {
          if (vm.user.autoUpdate) {
            notify.show({ type: "success", message: "Updating..." });
            vm.updateServiceWorker();
            return;
          }
          notify.show({
            type: "success",
            message: "Update available",
            progress: false,
            closable: false,
            actions: [
              {
                title: "Update",
                handler: () => {
                  vm.updateServiceWorker();
                },
              },
            ],
          });
        },
        onRegistered(swRegistration) {
          swRegistration && vm.handleSWManualUpdates(swRegistration);
        },
        onRegisterError(e) {
          vm.handleSWRegisterError(e);
        },
      });
    } catch {
      console.log("PWA disabled.");
    }
  },
  methods: {
    ...mapActions({
      logout: "auth/logout",
      updateUser: "auth/updateUser",
    }),
    ...mapMutations({
      saveHistoryLength: "app/SET_HISTORY",
    }),
    updateServiceWorker() {
      this.updateSW && this.updateSW(true);
    },
    handleSWManualUpdates(swRegistration) {
      console.log(swRegistration);
    },
    handleSWRegisterError(error) {
      console.error(error);
    },
  },
};
</script>
