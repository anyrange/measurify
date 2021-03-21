<template>
  <template v-if="this.user">
    <div class="flex flex-col h-screen text-sm text-gray-400">
      <div class="flex-1 flex overflow-y-hidden">
        <DashboardNav />
        <div class="bg-gray-800-spotify flex-1 flex flex-col">
          <div class="top-bar flex items-center justify-between px-4 py-2">
            <div class="flex items-center">
              <div class="ml-4 mt-2 relative">
                <input
                  type="text"
                  placeholder="Search"
                  class="bg-white text-gray-800 placeholder-gray-800 rounded-full px-3 pl-8 py-1"
                />
                <div class="absolute top-0">
                  <svg
                    class="fill-current text-gray-800 h-6 w-6 pt-1 pl-2"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                  >
                    <path
                      class="heroicon-ui"
                      d="M16.32 14.9l5.39 5.4a1 1 0 01-1.42 1.4l-5.38-5.38a8 8 0 111.41-1.41zM10 16a6 6 0 100-12 6 6 0 000 12z"
                    />
                  </svg>
                </div>
              </div>
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
</template>

<script>
import DashboardNav from "@/components/DashboardNav.vue";
import LoginLanding from "@/components/LoginLanding.vue";
import axios from "axios";

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
