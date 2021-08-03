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
        <div class="content-cards">
          <card :title="artist.followers">followers</card>
          <card
            v-for="(rate, index) in filteredArtistRates"
            :title="'#' + rate[1]"
            :key="index"
          >
            of your most streamed artists {{ $options.PERIODS[rate[0]] }}
          </card>
          <card
            v-for="(rate, index) in filteredTracksRates"
            :title="rate[1].length"
            :key="index"
          >
            times
            <span
              class="text-green-500-spotify font-bold cursor-pointer"
              @click="
                currentItem = rate[0];
                modalOpened = true;
              "
            >
              {{ artist.name }}
            </span>
            appeared in top 50 tracks

            {{
              rate[0] === "LT"
                ? $options.PERIODS[rate[0]]
                : "from the " + $options.PERIODS[rate[0]]
            }}
          </card>
        </div>
        <div class="content__item">
          <span class="content__item__label"> Audio features </span>
          <audio-features :audioFeatures="audioFeatures" />
        </div>
        <div class="content__item" v-if="artist.genres.length">
          <span class="content__item__label"> Genres </span>
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
          <span class="content__item__label"> Favourite tracks </span>
          <top-tracks :tracks="tracks" />
        </div>
      </div>
    </div>
    <modal :show="modalOpened" @close="modalOpened = false">
      <div class="flex flex-col gap-3 p-3">
        <h3 class="md:text-3xl sm:text-2xl text-xl font-semibold text-white">
          Most streamed tracks
        </h3>
        <span class="h-subtitle">
          The amount of times a track by {{ artist.name }} appeares in your top
          {{
            currentItem === "LT"
              ? $options.PERIODS[currentItem]
              : "from the " + $options.PERIODS[currentItem]
          }}
        </span>
        <hr />
        <div>
          <div
            class="flex flex-col gap-2 text-lg"
            v-for="(track, index) in tracksOfSelectedTerm"
            :key="index"
          >
            <router-link
              :to="{ name: 'track', params: { id: track.id } }"
              class="link"
            >
              #{{ track.place }} {{ track.name }}
            </router-link>
          </div>
        </div>
      </div>
    </modal>
  </template>
</template>

<script>
import { getArtist } from "@/api";
import SpotifyTitle from "@/components/SpotifyTitle.vue";
import BaseImg from "@/components/BaseImg.vue";
import Badge from "@/components/Badge.vue";
import Card from "@/components/Card.vue";
import Modal from "@/components/Modal.vue";
import AudioFeatures from "@/components/AudioFeatures.vue";
import TopTracks from "@/components/TopTracks.vue";

export default {
  components: {
    SpotifyTitle,
    BaseImg,
    Badge,
    Card,
    Modal,
    AudioFeatures,
    TopTracks,
  },
  data() {
    return {
      loading: true,
      artist: {},
      tracks: [],
      rates: {},
      audioFeatures: {},
      modalOpened: false,
      currentItem: null,
    };
  },
  PERIODS: {
    LT: "lifetime",
    MT: "past 6 months",
    ST: "past 4 weeks",
  },
  computed: {
    filteredArtistRates() {
      return Object.entries(this.rates.art).filter((item) => item[1]);
    },
    filteredTracksRates() {
      return Object.entries(this.rates.trc).filter((item) => item[1].length);
    },
    tracksOfSelectedTerm() {
      return this.rates.trc[this.currentItem];
    },
  },
  async created() {
    try {
      const response = await getArtist(this.$route.params.id);
      this.artist = response.artist;
      this.tracks = response.tracks;
      this.rates = response.rates;
      this.audioFeatures = response.audioFeatures;
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
