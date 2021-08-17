<template>
  <loading-spinner v-if="loading" />
  <div v-else class="w-full flex flex-col gap-4">
    <div class="w-full flex flex-row items-center gap-4">
      <base-img
        avatar
        :src="playlist.image"
        :alt="playlist.name"
        class="
          flex flex-none
          object-cover
          rounded-full
          sm:rounded-lg
          w-20
          h-20
          sm:w-48
          sm:h-48
          duration-300
        "
      />
      <div>
        <spotify-link :link="link">
          {{ playlist.name }}
        </spotify-link>
        <div class="text-base">
          <span class="text-gray-500-spotify">by </span>
          <router-link
            class="link"
            :to="{ name: 'profile', params: { id: owner.id } }"
          >
            {{ owner.name }}
          </router-link>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="content-cards">
        <card :title="collaborative ? 'collaborative' : 'non-collaborative'">
          type
        </card>
        <card :title="privacy ? 'public' : 'private'">privacy</card>
        <card :title="followers">followers</card>
        <card :title="totalTracks">tracks</card>
      </div>
      <div class="content__item" v-if="favouriteTracks.length">
        <span class="content__item__label"> Favourite tracks </span>
        <top-tracks :tracks="favouriteTracks" />
      </div>
    </div>
  </div>
</template>

<script>
import { getPlaylist } from "@/api";
import BaseImg from "@/components/BaseImg.vue";
import Card from "@/components/Card.vue";
import TopTracks from "@/components/TopTracks.vue";
import SpotifyLink from "@/components/SpotifyLink.vue";

export default {
  components: {
    BaseImg,
    Card,
    TopTracks,
    SpotifyLink,
  },
  data() {
    return {
      loading: true,
      playlist: {},
      favouriteTracks: [],
      link: "",
      collaborative: null,
      public: null,
      totalTracks: null,
      followers: null,
      owner: {},
      audioFeatures: {},
    };
  },
  async created() {
    try {
      const response = await getPlaylist(this.$route.params.id);
      this.favouriteTracks = response.favouriteTracks;
      this.collaborative = response.collaborative;
      this.audioFeatures = response.audioFeatures;
      this.totalTracks = response.totalTracks;
      this.followers = response.followers;
      this.playlist = response.playlist;
      this.privacy = response.public;
      this.owner = response.owner;
      this.link = response.link;
      document.title = `${this.playlist.name} - Spotiworm`;
      this.loading = false;
    } catch (error) {
      this.$router.push({ name: "home" });
    }
  },
};
</script>
