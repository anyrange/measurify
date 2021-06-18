<template>
  <loading-spinner v-if="loading" />
  <template v-else>
    <div class="flex flex-col gap-4">
      <figure class="responsive-picture">
        <base-img
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
          <card :title="album.popularity / 10" subtitle="popularity" />
          <card :title="album.total_tracks" subtitle="tracks amount" />
        </div>
        <div class="content__item" v-if="album.genres.length">
          <span class="content__item__label">
            Genres
          </span>
          <div class="flex flex-wrap gap-2">
            <badge v-for="(genre, index) in album.genres" :key="index">
              {{ genre }}
            </badge>
          </div>
        </div>
        <div class="content__item w-full md:w-3/4 lg:w-1/2" v-if="tracks.length">
          <span class="content__item__label">
            Listened tracks
          </span>
          <div class="flex flex-col gap-3">
            <div v-for="(item, index) in tracks" :key="index">
              <router-link
                :to="{ name: 'track', params: { id: item.id } }"
                class="flex flex-row items-center justify-between pr-3 hover:bg-gray-700-spotify duration-100 rounded-lg w-full"
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

export default {
  name: "Album",
  components: { SpotifyTitle, Card, Badge, BaseImg },
  data() {
    return {
      loading: true,
      album: {},
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
      const response = await getAlbum(this.$route.params.id);
      this.album = response.album;
      this.tracks = response.tracks;
      console.log(response);
      document.title = `${this.album.name} - Spotiworm`;
    } catch (error) {
      this.$router.push({ name: "home" });
    } finally {
      this.loading = false;
    }
  },
};
</script>
