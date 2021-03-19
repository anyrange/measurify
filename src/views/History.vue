<template>
  <ul class="container ">
    <li v-for="item in recentlyPlayed" :key="item.track.id">
      <a
        :href="item.track.external_urls.spotify"
        class="p-5 flex bg-gray-50 flex-row shadow-lg sm:rounded-3x1 m-3"
      >
        <img
          :src="item.track.album.images[0].url"
          class="w-24	h-24 border border-gray-100 shadow-sm"
        />
        <p class="pl-2">{{ item.track.name }}</p></a
      >
    </li>
  </ul>
  aboba
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      recentlyPlayed: [],
    };
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
  },
  created() {
    axios
      .get(
        `${process.env.VUE_APP_SERVER_URI}/getPlayedHistory?spotifyID=${this.user.id}`
      )
      .catch((err) => console.log(err))
      .then((response) => {
        this.recentlyPlayed = response.data;
      });
  },
};
</script>
