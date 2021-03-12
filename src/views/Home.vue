<template>
  <div class="login">
    <template v-if="this.user">
      <DashboardNav />
      <router-view />
      <div class="min-h-screen py-6 flex flex-col bg:gray sm:py-12">
        <div class="relative sm:max-w-xl sm:mx-auto">
          <div
            class="relative py-10 bg-gray-50 shadow-lg sm:rounded-3xl sm:p-20"
          >
            <div class="max-w-md mx-auto">
              <div class="divide-y divide-gray-200">
                <div
                  class="text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7"
                >
                  <h1>Account name: {{ this.user.display_name }}</h1>
                  <img
                    :src="this.user.images[0].url"
                    class="rounded-full border border-gray-100 shadow-sm"
                  />
                  <p>Email address: {{ this.user.email }}</p>
                  <p class="underline">
                    <a :href="this.user.external_urls.spotify"
                      >Link to your profile</a
                    >
                  </p>
                  <p>Number of followers: {{ this.user.followers.total }}</p>
                  <p>
                    <button
                      v-on:click="logOut()"
                      class="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                    >
                      Log out
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <button
        @click="login"
        class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full"
      >
        Log in with Spotify
      </button>
    </template>
  </div>
</template>

<script>
import axios from "axios";
import DashboardNav from "@/components/DashboardNav.vue";

export default {
  name: "Login",
  components: {
    DashboardNav,
  },
  data() {
    return {
      email: "",
    };
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
  },
  methods: {
    login() {
      window.location.href = process.env.VUE_APP_REDIRECT_URI;
    },
    logOut() {
      this.$store.commit("mutateUser", null);
      this.$router.push({ name: "Home" });
    },
  },
  created() {
    if (this.$route.query) {
      axios
        .get("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: "Bearer " + this.$route.query.access_token,
          },
        })
        .then((response) => {
          this.$store.commit("mutateUser", response.data);
          this.$router.push("/");
          console.log("Response from server: ");
          console.log(this.$store.state.user);
        });
    }
  },
};
</script>
