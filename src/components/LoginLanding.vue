<template>
  <div class="min-h-screen py-6 flex flex-col bg:gray sm:py-12">
    <div class="relative sm:max-w-xl sm:mx-auto">
      <button
        @click="login"
        class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full"
      >
        Log in with Spotify
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    playlists() {
      return this.$store.getters.getPlaylists;
    },
  },
  methods: {
    login() {
      window.location.href = `${process.env.VUE_APP_SERVER_URI}/login`;
    },
    logOut() {
      this.$store.commit("mutateUser", null);
      this.$router.push({ name: "Home" });
    },
  },
  created() {
    if (this.$route.query) {
      let access_token = this.$route.query.access_token;
      axios
        .get("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: "Bearer " + access_token,
          },
        })
        .then((response) => {
          response.data.refresh_token = this.$route.query.refresh_token;
          response.data.access_token = this.$route.query.access_token;
          this.$store.commit("mutateUser", response.data);
          this.$router.push("/");
          console.log("Response from server: ");
          console.log(this.$store.state.user);
        });
    }
  },
};
</script>
