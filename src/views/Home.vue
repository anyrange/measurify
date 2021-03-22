<template>
  <template v-if="this.user">
    <div class="flex flex-col h-screen text-sm text-gray-400">
      <div class="flex-1 flex overflow-y-hidden">
        <Sidebar />
        <div class="dark:bg-gray-800-spotify bg-gray-100 flex-1 flex flex-col">
          <div class="top-bar flex items-center justify-end px-4 py-4">
            <div class="flex items-center">
              <img
                :src="this.user.images[0]?.url"
                class="object-fill w-6 h-6 rounded-full"
              />
              <a
                href="#"
                class="ml-2 hover:underline dark:text-gray-400 text-gray-500 dark:hover:text-white hover:text-gray-400"
              >
                {{ this.user.display_name }}</a
              >
              <button class="ml-4 focus:outline-none">
                <svg
                  class="fill-current text-gray-400 hover:text-white w-6 h-6"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path
                    class="heroicon-ui"
                    d="M15.3 9.3a1 1 0 011.4 1.4l-4 4a1 1 0 01-1.4 0l-4-4a1 1 0 011.4-1.4l3.3 3.29 3.3-3.3z"
                  />
                </svg>
              </button>
            </div>
          </div>
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
import LoginLanding from "@/components/LoginLanding.vue";
import UpdateNotification from "@/components/UpdateNotification.vue";
import axios from "axios";

export default {
  name: "Layout",
  components: {
    Sidebar,
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
