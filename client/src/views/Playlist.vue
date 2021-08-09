<template>
  <loading-spinner v-if="loading" />
  <div v-else class="w-ful flex flex-col gap-4">
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
        <spotify-link :link="playlist.link">
          {{ playlist.name }}
        </spotify-link>
        <div class="text-base">
          <span class="text-gray-500-spotify">by </span>
          <router-link
            class="link"
            :to="{ name: 'profile', params: { id: playlist.owner.id } }"
          >
            {{ playlist.owner.name }}
          </router-link>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="content-cards">
        <card
          :title="
            playlist.collaborative ? 'collaborative' : 'non-collaborative'
          "
        >
          type
        </card>
        <card :title="playlist.public ? 'public' : 'private'">privacy</card>
        <card :title="playlist.followers">followers</card>
        <card :title="playlist.tracks">tracks</card>
      </div>
      <div class="content__item" v-if="tracks.length">
        <span class="content__item__label">Listened tracks</span>
        <!-- <tracks-list :tracks="tracks" /> -->
        {{ tracks }}
      </div>
    </div>
  </div>
</template>

<script>
import { getPlaylist } from "@/api";
import BaseImg from "@/components/BaseImg.vue";
import Card from "@/components/Card.vue";
import TracksList from "@/components/TracksList.vue";
import SpotifyLink from "@/components/SpotifyLink.vue";

export default {
  components: {
    BaseImg,
    Card,
    // eslint-disable-next-line vue/no-unused-components
    TracksList,
    SpotifyLink,
  },
  data() {
    return {
      loading: true,
      playlist: {},
      tracks: [],
      audioFeatures: {},
    };
  },
  async created() {
    try {
      const response = await getPlaylist(this.$route.params.id);
      this.playlist = response.playlist;
      this.tracks = response.tracks;
      this.audioFeatures = response.audioFeatures;
      document.title = `${this.playlist.name} - Spotiworm`;
      this.loading = false;
    } catch (error) {
      this.$router.push({ name: "home" });
    }
  },
};
</script>