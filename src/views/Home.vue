<template>
  <template v-if="this.user">
    <div class="flex flex-col h-screen text-sm text-gray-400">
      <div class="flex-1 flex overflow-y-hidden">
        <DashboardNav />
        <div class="bg-gray-800-spotify flex-1 flex flex-col">
          <div class="content-spotify overflow-y-auto">
            <router-view />
          </div>
        </div>
      </div>
    </div>
  </template>
  <template v-else>
    <LoginLanding />
  </template>
  <UpdateNotification />
</template>

<script>
import DashboardNav from "@/components/DashboardNav.vue";
import LoginLanding from "@/components/LoginLanding.vue";
import UpdateNotification from "@/components/UpdateNotification.vue";
import axios from "axios";

export default {
  name: "Login",
  components: {
    DashboardNav,
    LoginLanding,
    UpdateNotification,
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
  },
  created() {
    if (this.user) {
      axios
        .get(
          `${process.env.VUE_APP_SERVER_URI}/getAccessToken?spotifyID=${this.user.id}`
        )
        .catch((err) => console.log(err))
        .then((response) => {
          let updatedUser = this.user;
          updatedUser.access_token = response.data;
          this.$store.commit("mutateUser", updatedUser);
        });
    }
  },
};
</script>
