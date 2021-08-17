<template>
  <loading-spinner v-if="loading" />
  <div v-else class="flex flex-col gap-4">
    <figure class="responsive-picture">
      <base-img
        parallax
        :src="album.image"
        :alt="album.name"
        class="responsive-picture__image"
      />
      <figcaption class="responsive-picture__title">
        <spotify-link :link="link">
          {{ album.name }}
        </spotify-link>
      </figcaption>
    </figure>
    <div class="content">
      <div class="content-cards">
        <card :title="popularity / 10">popularity</card>
        <card :title="total_tracks">tracks amount</card>
      </div>
      <div class="content__item">
        <span class="content__item__label"> Audio features </span>
        <audio-features
          class="content-audio-features"
          :audioFeatures="audioFeatures"
        />
      </div>
      <div class="content__item">
        <span class="content__item__label"> Artist </span>
        <div class="content__item__boxes">
          <router-link
            class="link"
            v-for="(item, index) in album.artists"
            :key="index"
            :to="{ name: 'artist', params: { id: item.id } }"
          >
            <div class="content__item__boxes__box">
              <base-img
                :src="item.image"
                :alt="item.name"
                class="content__item__boxes__box__image"
              />
              <div class="content__item__boxes__box__label">
                {{ item.name }}
              </div>
            </div>
          </router-link>
        </div>
      </div>
      <div class="content__item" v-if="genres.length">
        <span class="content__item__label"> Genres </span>
        <div class="flex flex-wrap gap-2">
          <badge v-for="(genre, index) in genres" :key="index">
            {{ genre }}
          </badge>
        </div>
      </div>
      <div class="content__item" v-if="favouriteTracks.length">
        <span class="content__item__label"> Favourite tracks </span>
        <top-tracks :tracks="favouriteTracks" />
      </div>
    </div>
  </div>
</template>

<script>
import { getAlbum } from "@/api";
import SpotifyLink from "@/components/SpotifyLink.vue";
import Card from "@/components/Card.vue";
import BaseImg from "@/components/BaseImg.vue";
import Badge from "@/components/Badge.vue";
import AudioFeatures from "@/components/AudioFeatures.vue";
import TopTracks from "@/components/TopTracks.vue";

export default {
  name: "Album",
  components: {
    SpotifyLink,
    Card,
    Badge,
    BaseImg,
    AudioFeatures,
    TopTracks,
  },
  data() {
    return {
      loading: true,
      album: {},
      popularity: null,
      total_tracks: null,
      link: null,
      genres: [],
      audioFeatures: {},
      favouriteTracks: [],
    };
  },
  async created() {
    try {
      const response = await getAlbum(this.$route.params.id);
      this.album = response.album;
      this.favouriteTracks = response.favouriteTracks;
      this.total_tracks = response.total_tracks;
      this.link = response.link;
      this.genres = response.genres;
      this.popularity = response.popularity;
      this.audioFeatures = response.audioFeatures;
      document.title = `${this.album.name} - Spotiworm`;
    } catch (error) {
      this.$router.push({ name: "home" });
    } finally {
      this.loading = false;
    }
  },
};
</script>
