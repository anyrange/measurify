<template>
  <router-view />
  <update-notification />
  <notifications />
</template>

<script>
import Notifications from "@/components/Notifications";
import UpdateNotification from "@/components/UpdateNotification";

export default {
  components: {
    UpdateNotification,
    Notifications,
  },
};
</script>

<style src="@/assets/styles.css"></style>
