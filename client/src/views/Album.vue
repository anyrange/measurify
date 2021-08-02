<template>
  <loading-spinner v-if="loading" />
  <template v-else>
    <div class="flex flex-col gap-4">
      <figure class="responsive-picture">
        <base-img
          parallax
          :src="album.image"
          :alt="album.name"
          class="responsive-picture__image"
        />
        <figcaption class="responsive-picture__title">
          <spotify-title :name="album.name" :link="album.link" />
        </figcaption>
      </figure>
      <div class="content">
        <div class="mt-2 flex flex-wrap gap-2">
          <card :title="album.popularity / 10">popularity</card>
          <card :title="album.total_tracks">tracks amount</card>
        </div>
        <div class="content__item">
          <span class="content__item__label"> Audio features </span>
          <audio-features :audioFeatures="audioFeatures" />
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
        <div class="content__item" v-if="album.genres.length">
          <span class="content__item__label"> Genres </span>
          <div class="flex flex-wrap gap-2">
            <badge v-for="(genre, index) in album.genres" :key="index">
              {{ genre }}
            </badge>
          </div>
        </div>
        <div
          class="content__item w-full md:w-3/4 lg:w-1/2"
          v-if="tracks.length"
        >
          <span class="content__item__label"> Listened tracks </span>
          <div class="flex flex-col gap-3">
            <div v-for="(item, index) in tracks" :key="index">
              <router-link
                :to="{ name: 'track', params: { id: item.id } }"
                class="
                  flex flex-row
                  items-center
                  justify-between
                  pr-3
                  hover:bg-gray-700-spotify
                  duration-100
                  rounded-lg
                  w-full
                "
              >
                <div class="flex items-center gap-3">
                  <base-img
                    :src="item.image"
                    :alt="item.name"
                    class="w-12 h-12 object-cover rounded-lg"
                  />
                  <div class="flex flex-col">
                    <div class="text-white text-base">
                      {{ item.name }}
                    </div>
                    <div class="text-gray-400-spotify text-sm font-normal">
                      {{ getDateFromNow(item.lastPlayedAt) }}
                    </div>
                  </div>
                </div>
                <div class="text-white text-lg font-medium">
                  {{ item.playtime }}
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<script>
import { getAlbum } from "@/api";
import SpotifyTitle from "@/components/SpotifyTitle.vue";
import Card from "@/components/Card.vue";
import BaseImg from "@/components/BaseImg.vue";
import Badge from "@/components/Badge.vue";
import { formatDistanceToNowStrict } from "date-fns";
import AudioFeatures from "@/components/AudioFeatures.vue";

export default {
  name: "Album",
  components: { SpotifyTitle, Card, Badge, BaseImg, AudioFeatures },
  data() {
    return {
      loading: true,
      album: {},
      audioFeatures: {},
      tracks: [],
    };
  },
  async created() {
    try {
      const response = await getAlbum(this.$route.params.id);
      this.album = response.album;
      this.tracks = response.tracks;
      this.audioFeatures = response.audioFeatures;
      console.log(response);
      document.title = `${this.album.name} - Spotiworm`;
    } catch (error) {
      this.$router.push({ name: "home" });
    } finally {
      this.loading = false;
    }
  },
  methods: {
    getDateFromNow(date) {
      return formatDistanceToNowStrict(Date.parse(date), {
        addSuffix: true,
      });
    },
  },
};
</script>
