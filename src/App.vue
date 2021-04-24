<template>
  <router-view />
  <UpdateNotification />
</template>

<script>
import UpdateNotification from "@/components/UpdateNotification.vue";

export default {
  components: {
    UpdateNotification,
  },
};
</script>

<style src="@/assets/styles.css"></style>
