<template>
  <loading-spinner v-if="loading" />
  <template v-else>
    <div class="flex flex-col gap-4">
      <figure class="responsive-picture">
        <base-img
          parallax
          :src="artist.image"
          :alt="artist.name"
          class="responsive-picture__image"
        />
        <figcaption class="responsive-picture__title">
          <spotify-title :name="artist.name" :link="artist.link" />
        </figcaption>
      </figure>
      <div class="content">
        <div class="mt-2 flex flex-wrap gap-2">
          <card :title="artist.followers" subtitle="followers" />
        </div>
        <div class="content__item" v-if="artist.genres.length">
          <span class="content__item__label">
            Genres
          </span>
          <div class="flex flex-wrap gap-2">
            <badge v-for="(genre, index) in artist.genres" :key="index">
              {{ genre }}
            </badge>
          </div>
        </div>
        <div
          class="content__item w-full md:w-3/4 lg:w-1/2"
          v-if="tracks.length"
        >
          <span class="content__item__label">
            Listened tracks
          </span>
          <div class="flex flex-col gap-3">
            <div v-for="(track, index) in tracks" :key="index">
              <router-link
                :to="{ name: 'track', params: { id: track.id } }"
                class="flex flex-row items-center justify-between pr-3 hover:bg-gray-700-spotify duration-100 rounded-lg w-full"
              >
                <div class="flex items-center gap-3">
                  <base-img
                    :src="track.image"
                    :alt="track.name"
                    class="w-12 h-12 object-cover rounded-lg"
                  />
                  <div class="flex flex-col">
                    <div class="text-white text-base">
                      {{ track.name }}
                    </div>
                    <div class="text-gray-400-spotify text-sm font-normal">
                      {{ getDateFromNow(track.lastPlayedAt) }}
                    </div>
                  </div>
                </div>
                <div class="text-white text-base text-right font-medium">
                  {{ track.playtime }}
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
import { formatDistanceToNowStrict } from "date-fns";
import { getArtist } from "@/api";
import SpotifyTitle from "@/components/SpotifyTitle.vue";
import BaseImg from "@/components/BaseImg.vue";
import Badge from "@/components/Badge.vue";
import Card from "@/components/Card.vue";

export default {
  components: { SpotifyTitle, BaseImg, Badge, Card },
  data() {
    return {
      loading: true,
      artist: {},
      tracks: [],
    };
  },
  methods: {
    getDateFromNow(date) {
      return formatDistanceToNowStrict(Date.parse(date), {
        addSuffix: true,
      });
    },
  },
  async created() {
    try {
      const response = await getArtist(this.$route.params.id);
      console.log(response);
      this.artist = response.artist;
      this.tracks = response.tracks;
      document.title = `${this.artist.name} - Spotiworm`;
    } catch (error) {
      this.$router.push({ name: "home" });
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style></style>
