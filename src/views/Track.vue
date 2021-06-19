<template>
  <loading-spinner v-if="loading" />
  <template v-else>
    <div class="flex flex-col gap-4">
      <figure class="responsive-picture">
        <base-img
          :src="track.image"
          :alt="track.name"
          class="responsive-picture__image"
        />
        <figcaption class="responsive-picture__title">
          <spotify-title :name="track.name" :link="track.link" />
        </figcaption>
      </figure>
      <div class="content">
        <div class="mt-2 flex flex-wrap gap-2">
          <card :title="track.popularity / 10" subtitle="popularity" />
          <card :title="trackDuration" subtitle="track length" />
          <card :title="releaseDate" subtitle="release date" />
          <card
            v-if="overview.playtime"
            :title="overview.playtime"
            subtitle="minutes listened"
          />
          <card
            v-if="overview.plays"
            :title="overview.plays"
            subtitle="times played"
          />
        </div>
        <div class="content__item">
          <span class="content__item__label">
            Album
          </span>
          <router-link :to="{ name: 'album', params: { id: track.album.id } }">
            <div
              class="flex flex-row items-center justify-center gap-3 pr-3 hover:bg-gray-700-spotify duration-100 rounded-2xl"
            >
              <img :src="track.image" class="w-20 rounded-xl" />
              <div class="flex flex-col">
                <div class="text-base text-white font-medium truncate-2">
                  {{ track.album.name }}
                </div>
                <div class="text-sm text-white font-light">
                  <template v-for="artist in track.artists" :key="artist.id">
                    {{ artist.name }}
                  </template>
                </div>
              </div>
            </div>
          </router-link>
        </div>
        <div class="content__item">
          <span class="content__item__label">
            Artist
          </span>
          <div class="content__item__boxes">
            <router-link
              class="link"
              v-for="(item, index) in track.artists"
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
      </div>
    </div>
  </template>
</template>

<script>
import { addSeconds, format } from "date-fns";
import { getTrack } from "@/api";
import SpotifyTitle from "@/components/SpotifyTitle.vue";
import Card from "@/components/Card.vue";
import BaseImg from "@/components/BaseImg.vue";

export default {
  components: { SpotifyTitle, Card, BaseImg },
  data() {
    return {
      loading: true,
      selectedPeriod: "alltime",
      track: {},
      overview: {},
    };
  },
  computed: {
    releaseDate() {
      return format(new Date(this.track.release_date), "MMM do yyyy");
    },
    trackDuration() {
      return format(
        addSeconds(new Date(0), this.track.duration_ms / 1000),
        "mm:ss"
      );
    },
  },
  async created() {
    try {
      const response = await getTrack(this.$route.params.id);
      this.track = response.track;
      this.overview = response.overview;
      document.title = `${this.track.name} - Spotiworm`;
    } catch (error) {
      this.$router.push({ name: "home" });
    } finally {
      this.loading = false;
    }
  },
};
</script>
