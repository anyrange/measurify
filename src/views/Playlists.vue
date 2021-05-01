<template>
  <h2 class="h-title">Playlists</h2>
  <div class="mt-10">
    <div class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="playlist in playlists"
        :key="playlist.id"
        class="box-border h-84 w-64 p-5"
      >
        <img
          :src="playlist.images[0]?.url"
          class="border border-gray-800 shadow-sm object-cover h-48 w-48 rounded-lg"
        />
        <h1
          class="mt-2 text-base text-gray-300 overflow-ellipsis overflow-hidden whitespace-nowrap"
        >
          {{ playlist.name }}
        </h1>
        <h1 class="text-sm text-gray-400">
          Total tracks: {{ playlist.tracks.total }}
        </h1>
      </div>
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
    playlistsLoad(uri) {
      axios
        .get(uri, {
          headers: {
            Authorization: "Bearer " + this.user.access_token,
          },
        })
        .then((response) => {
          let currentPlaylistList = this.playlists;
          currentPlaylistList.push(...response.data.items);

          this.$store.commit("mutatePlaylists", currentPlaylistList);
          if (response.data.total > this.playlists.length) {
            let leftover = response.data.total - this.playlists.length;
            this.playlistsLoad(
              `https://api.spotify.com/v1/users/${
                this.user.id
              }/playlists?offset=${this.playlists.length}&limit=${
                leftover < 20 ? leftover : 20
              }`
            );
          }
          console.log(response.data.items);
        });
    },
  },
  mounted() {
    axios
      .get(`https://api.spotify.com/v1/users/${this.user.id}/playlists`, {
        headers: {
          Authorization: "Bearer " + this.user.access_token,
        },
      })
      .then((response) => {
        this.$store.commit("mutatePlaylists", response.data.items);
        if (response.data.total > this.playlists.length) {
          let leftover = response.data.total - this.playlists.length;
          this.playlistsLoad(
            `https://api.spotify.com/v1/users/${
              this.user.id
            }/playlists?offset=${this.playlists.length}&limit=${
              leftover < 20 ? leftover : 20
            }`
          );
        }
        console.log("Response from server: ");
        console.log(response.data.items);
      });
  },
};
</script>
