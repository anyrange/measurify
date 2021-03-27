<template>
  <div
    class="min-h-screen bg-cover flex justify-center items-center"
    :style="cssProps"
  >
    <div class="flex flex-col items-center justify-center w-3/4">
      <h1 class="text-7xl text-gray-100">
        Spotify Worm
      </h1>
      <h1 class="text-xl mb-6 mt-6 text-gray-300">
        Track your listening history and get stats
      </h1>
      <button @click="login" class="sign-in-button">
        Sign in with Spotify
      </button>
    </div>
  </div>
</template>

<style>
.sign-in-button {
  @apply py-2 px-6 bg-green-600-spotify text-lg rounded-full hover:bg-green-700-spotify transition-colors duration-150 text-white font-semibold focus:outline-none;
}
</style>

<script>
import axios from "axios";

export default {
  data() {
    return {
      cssProps: {
        backgroundImage: `url(${require("@/assets/1Cover.png")})`,
      },
    };
  },

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
    if(!this.user._id){
      this.logOut()
    }
    if (this.$route.query) {
      const access_token = this.$route.query.access_token;
      axios
        .get("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: "Bearer " + access_token,
          },
        })
        .then((response) => {
          response.data.refresh_token = this.$route.query.refresh_token;
          response.data.access_token = access_token;
          response.data._id = this.$route.query.id;
          this.$store.commit("mutateUser", response.data);
          this.$router.push("/");
          console.log("Response from server: ");
          console.log(this.$store.state.user);
        });
    }
  },
};
</script>
