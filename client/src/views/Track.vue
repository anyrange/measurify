<template>
  <loading-spinner v-if="loading" />
  <template v-else>
    <div class="flex flex-col gap-4">
      <figure class="responsive-picture">
        <base-img
          parallax
          :src="track.image"
          :alt="track.name"
          class="responsive-picture__image"
        />
        <figcaption class="responsive-picture__title">
          <spotify-title :name="track.name" :link="track.link" />
        </figcaption>
      </figure>
      <div class="content">
        <div class="content-cards">
          <card :title="track.popularity / 10">popularity</card>
          <card :title="trackDuration">track length</card>
          <card :title="releaseDate">release date</card>
          <card v-if="overview.playtime" :title="overview.playtime">
            minutes listened
          </card>
          <card v-if="overview.plays" :title="overview.plays">
            times played
          </card>
          <card
            v-for="(rate, index) in filteredTrackRates"
            :title="'#' + rate[1]"
            :key="index"
          >
            of your most streamed tracks {{ $options.PERIODS[rate[0]] }}
          </card>
        </div>
        <div class="content__item">
          <span class="content__item__label"> Audio features </span>
          <audio-features :audioFeatures="audioFeatures" />
        </div>
        <div class="content__item">
          <span class="content__item__label"> Album </span>
          <router-link :to="{ name: 'album', params: { id: track.album.id } }">
            <div
              class="
                flex flex-row
                items-center
                justify-center
                gap-3
                pr-3
                hover:bg-gray-700-spotify
                duration-100
                rounded-2xl
              "
            >
              <base-img
                class="w-20 h-20 rounded-xl"
                :src="track.image"
                :alt="track.name"
              />
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
          <span class="content__item__label"> Artist </span>
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
import AudioFeatures from "@/components/AudioFeatures.vue";

export default {
  components: { SpotifyTitle, Card, BaseImg, AudioFeatures },
  data() {
    return {
      loading: true,
      selectedPeriod: "alltime",
      track: {},
      rates: {},
      overview: {},
      audioFeatures: {},
    };
  },
  PERIODS: {
    LT: "lifetime",
    MT: "past 6 months",
    ST: "past 4 weeks",
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
    filteredTrackRates() {
      return Object.entries(this.rates).filter((item) => item[1]);
    },
  },
  async created() {
    try {
      const response = await getTrack(this.$route.params.id);
      this.track = response.track;
      this.rates = response.rates;
      this.overview = response.overview;
      this.audioFeatures = response.audioFeatures;
      document.title = `${this.track.name} - Spotiworm`;
    } catch (error) {
      this.$router.push({ name: "home" });
    } finally {
      this.loading = false;
    }
  },
};
</script>
