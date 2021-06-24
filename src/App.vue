<template>
  <router-view />
  <update-notification />
  <notifications />
</template>

<script>
import Notifications from "@/components/Notifications";
import UpdateNotification from "@/components/UpdateNotification";
import { mapActions } from "vuex";

export default {
  components: {
    UpdateNotification,
    Notifications,
  },
  methods: {
    ...mapActions(["updateUser", "logout"]),
  },
  async created() {
    try {
      await this.updateUser();
      this.$router.push({ name: "home" });
    } catch {
      this.logout();
    }
  },
};
</script>
