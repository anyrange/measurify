<template>
  <router-view />
  <update-notification />
  <notifications />
</template>

<script>
import UpdateNotification from "@/components/UpdateNotification.vue";
import Notifications from "@/components/Notifications.vue";

export default {
  components: {
    UpdateNotification,
    Notifications,
  },
};
</script>

<style src="@/assets/styles.css"></style>
