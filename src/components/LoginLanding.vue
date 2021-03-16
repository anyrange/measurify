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
  name: "Stats",
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
      window.location.href = process.env.VUE_APP_REDIRECT_URI;
    },
    logOut() {
      this.$store.commit("mutateUser", null);
      this.$router.push({ name: "Home" });
    },
    playlistsLoad(uri, access_token) {
      axios
        .get(uri, {
          headers: {
            Authorization: "Bearer " + access_token,
          },
        })
        .then((response) => {
          let currentPlaylistList = this.$store.state.playlists;
          currentPlaylistList.push(...response.data.items);

          this.$store.commit("mutatePlaylists", currentPlaylistList);
          if (response.data.total > this.$store.state.playlists.length) {
            let leftover =
              response.data.total - this.$store.state.playlists.length;
            this.playlistsLoad(
              `https://api.spotify.com/v1/users/${
                this.$store.state.user.id
              }/playlists?offset=${this.$store.state.playlists.length}&limit=${
                leftover < 20 ? leftover : 20
              }`,
              access_token
            );
          }
          console.log("Response from server: ");
          console.log(response.data.items);
        });
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
          axios
            .get(
              `https://api.spotify.com/v1/users/${response.data.id}/playlists`,
              {
                headers: {
                  Authorization: "Bearer " + access_token,
                },
              }
            )
            .then((response) => {
              this.$store.commit("mutatePlaylists", response.data.items);
              if (response.data.total > this.$store.state.playlists.length) {
                let leftover =
                  response.data.total - this.$store.state.playlists.length;
                this.playlistsLoad(
                  `https://api.spotify.com/v1/users/${
                    this.$store.state.user.id
                  }/playlists?offset=${
                    this.$store.state.playlists.length
                  }&limit=${leftover < 20 ? leftover : 20}`,
                  access_token
                );
              }
              console.log("Response from server: ");
              console.log(response.data.items);
            });
          this.$router.push("overview");
          console.log("Response from server: ");
          console.log(this.$store.state.user);
        });
    }
  },
};
</script>
