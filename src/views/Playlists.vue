<template>
  <div class="grid grid-cols-3 gap-4">
    <div
      v-for="playlist in playlists"
      :key="playlist.id"
      class="box-border h-84 w-64 p-5 border-4"
    >
      <img
        :src="playlist.images[0]?.url"
        class=" border border-gray-100 shadow-sm"
      />
      {{ playlist.name }}<br />
      Total tracks: {{ playlist.tracks.total }}
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
          console.log("Response from server: ");
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
