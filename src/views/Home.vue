<template>
  <template v-if="this.user">
    <div class="wrapper">
      <div class="horizontal-flex">
        <Sidebar />
        <div class="main">
          <div class="top-bar flex items-center justify-end px-4">
            <User />
          </div>
          <div class="content-spotify overflow-y-auto">
            <router-view />
          </div>
        </div>
      </div>
    </div>
  </template>
  <template v-else>
    <Login />
  </template>
  <UpdateNotification />
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";
import User from "@/components/User.vue";
import Login from "@/components/Login.vue";
import UpdateNotification from "@/components/UpdateNotification.vue";
import axios from "axios";

export default {
  name: "Layout",
  components: {
    Sidebar,
    User,
    Login,
    UpdateNotification,
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
  },
  created() {
    if (this.user) {
      if (!this.user._id) {
        this.$store.commit("mutateUser", null);
        this.$router.push({ name: "Home" });
      }
      axios
        .get(`${process.env.VUE_APP_SERVER_URI}/token`, {
          headers: {
            Authorization: this.user._id,
          },
        })
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

<style>
.wrapper {
  @apply flex flex-col h-screen text-sm dark:text-gray-400 text-gray-900;
}
.horizontal-flex {
  @apply flex-1 flex overflow-y-hidden;
}
.main {
  @apply dark:bg-gray-800-spotify bg-gray-100 flex-1 flex flex-col;
}
</style>
