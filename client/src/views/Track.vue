<template>
  <loading-spinner v-if="loading" />
  <div v-else class="flex flex-col gap-4">
    <figure class="responsive-picture">
      <base-img
        parallax
        :src="track.image"
        :alt="track.name"
        class="responsive-picture__image"
      />
      <figcaption class="responsive-picture__title">
        <spotify-link :link="track.link">
          {{ track.name }}
        </spotify-link>
      </figcaption>
    </figure>
    <div class="content w-full">
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
        <span class="content__item__label">Audio features</span>
        <audio-features
          class="content-audio-features"
          :audioFeatures="audioFeatures"
        />
      </div>
      <div class="content__item">
        <span class="content__item__label"> Album </span>
        <div class="fullwidth">
          <div
            class="
              flex flex-row
              items-center
              duration-100
              rounded-lg
              gap-3
              pr-3
              truncate
            "
          >
            <router-link
              class="flex-shrink-0"
              :to="{ name: 'album', params: { id: track.album.id } }"
            >
              <base-img
                class="w-20 h-20 rounded-lg"
                :src="track.image"
                :alt="track.name"
              />
            </router-link>
            <div class="flex flex-col gap-1">
              <router-link
                class="link font-medium truncate-2"
                :to="{ name: 'album', params: { id: track.album.id } }"
              >
                {{ track.album.name }}
              </router-link>
              <multi-router :routes="track.artists" />
            </div>
          </div>
        </div>
      </div>
      <div class="content__item">
        <span class="content__item__label">Artist</span>
        <div class="content__item__boxes">
          <spotify-box
            v-for="item in track.artists"
            :key="item.id"
            :item="item"
            type="artist"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { addSeconds, format } from "date-fns";
import { getTrack } from "@/api";
import SpotifyLink from "@/components/SpotifyLink.vue";
import Card from "@/components/Card.vue";
import BaseImg from "@/components/BaseImg.vue";
import AudioFeatures from "@/components/AudioFeatures.vue";
import SpotifyBox from "@/components/SpotifyBox.vue";
import MultiRouter from "@/components/MultiRouter.vue";

export default {
  components: {
    SpotifyLink,
    Card,
    BaseImg,
    AudioFeatures,
    SpotifyBox,
    MultiRouter,
  },
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
