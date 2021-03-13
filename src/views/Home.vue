<template>
  <template v-if="this.user">
    <div class="flex flex-wrap bg-gray-100 w-full h-screen">
      <DashboardNav />
      <div class="w-10/12">
        <router-view />
      </div>
    </div>
  </template>
  <template v-else>
    <LoginLanding />
  </template>
</template>

<script>
import DashboardNav from "@/components/DashboardNav.vue";
import LoginLanding from "@/components/LoginLanding.vue";

export default {
  name: "Login",
  components: {
    DashboardNav,
    LoginLanding,
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
  },
};
</script>
