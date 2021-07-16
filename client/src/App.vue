<template>
  <router-view />
  <update-notification />
  <notifications />
</template>

<script>
import Notifications from "@/components/Notifications";
import UpdateNotification from "@/components/UpdateNotification";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    UpdateNotification,
    Notifications,
  },
  computed: {
    ...mapGetters(["isAuthenticated"]),
  },
  methods: {
    ...mapActions(["updateUser", "logout"]),
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
};
</script>
