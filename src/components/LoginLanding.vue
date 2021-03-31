<template>
  <div class="login-landing" :style="landingImage">
    <div class="login-container">
      <h1 class="app-title">
        Spotiworm
      </h1>
      <h1 class="app-description">
        Track your listening history and get stats
        <p v-if='usersQuantity'>Number of our users - {{usersQuantity}}</p>
      </h1>
      <button @click="login" class="login-button">
        Sign in with Spotify
      </button>
    </div>
  </div>
</template>

<style>
.login-landing {
  @apply min-h-screen bg-cover flex justify-center items-center;
}
.login-container {
  @apply flex flex-col items-center justify-center w-3/4;
}
.app-title {
  @apply text-7xl text-gray-100;
}
.app-description {
  @apply text-lg mb-6 mt-6 text-gray-300;
}
.login-button {
  @apply py-2 px-6 bg-green-600-spotify text-lg rounded-full hover:bg-green-700-spotify transition-colors duration-150 text-white font-semibold focus:outline-none;
}
</style>

<script>
import axios from "axios";

export default {
  data() {
    return {
      landingImage: {
        backgroundImage: `url(${require("@/assets/images/banner.png")})`,
      },
      usersQuantity: 0,
    };
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
  },
  methods: {
    login() {
      window.location.href = `${process.env.VUE_APP_SERVER_URI}/login`;
    },
  },
  created() {
    if (this.$route.query.access_token) {
      const access_token = this.$route.query.access_token;
      axios
        .get("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: "Bearer " + access_token,
          },
        })
        .then((response) => {
          response.data.access_token = access_token;
          response.data._id = this.$route.query.id;
          this.$store.commit("mutateUser", response.data);
          this.$router.push("/");
        });
    }
    axios.get(`${process.env.VUE_APP_SERVER_URI}/users`).then((response) => {
      this.usersQuantity = response.data.usersQuantity;
    });
  },
};
</script>
