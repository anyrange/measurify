<template>
  <template v-if="this.user._id">
    <div
      class="flex flex-col h-screen text-sm dark:text-gray-400 text-gray-900"
    >
      <div class="flex-1 flex overflow-y-hidden">
        <Sidebar />
        <div class="dark:bg-gray-800-spotify bg-gray-100 flex-1 flex flex-col">
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
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";
import User from "@/components/User.vue";
import axios from "axios";

export default {
  name: "Layout",
  components: {
    Sidebar,
    User,
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
  },
  created() {
    if (this.user._id) {
      axios
        .get(`${this.$store.getters.getBackendURL}/token`, {
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
    } else {
      this.$router.push({ name: "login" });
    }
  },
};
</script>
