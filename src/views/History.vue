<template>
  <!-- <ul class="container ">
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
  </ul> -->
  aboba
  {{ data }}
</template>

<script>
// import axios from "axios";

export default {
  data() {
    return {
      data: " ",
    };
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
  },
  created() {

    // axios
    //   .get("https://api.spotify.com/v1/me/player/recently-played?limit=50", {
    //     headers: {
    //       Authorization: "Bearer " + this.user.access_token,
    //     },
    //   })
    //   .catch((error) => {
    //     console.log("Ашыбка: " + error);

    //     axios
    //       .post(
    //         `${process.env.VUE_APP_REFRESH_URI}?refresh_token=${this.user.refresh_token}?id=${this.user.id}`
    //       )
    //       .then((response) => {
    //         let user = this.user;
    //         user.access_token = response.data;
    //         this.$store.commit("mutateUser", user);
    //       });
    //   })
    //   .then((response) => {
    //     this.recentlyPlayed = response.data.items;
    //   });
  },
};
</script>
