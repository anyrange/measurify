<template>
  <template v-if="this.user">
    <div
      class="flex flex-col h-screen text-sm dark:text-gray-400 text-gray-900"
    >
      <div class="flex-1 flex overflow-y-hidden">
        <Sidebar />
        <div class="dark:bg-gray-800-spotify bg-gray-100 flex-1 flex flex-col">
          <UserBar />
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

<style>
.h-title {
  @apply mx-4 text-5xl font-semibold dark:text-white text-gray-900;
}
</style>

<script>
import Sidebar from "@/components/Sidebar.vue";
import UserBar from "@/components/UserBar.vue";
import LoginLanding from "@/components/LoginLanding.vue";
import UpdateNotification from "@/components/UpdateNotification.vue";
import axios from "axios";

export default {
  name: "Layout",
  components: {
    Sidebar,
    UserBar,
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
          `${process.env.VUE_APP_SERVER_URI}/token?spotifyID=${this.user.id}`
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
