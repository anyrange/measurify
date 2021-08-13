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
              w-full
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
                class="sm:w-20 sm:h-20 w-24 h-24 rounded-lg"
                :src="track.image"
                :alt="track.name"
              />
            </router-link>
            <div class="flex flex-col gap-1 w-full">
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
      <div class="content__item">
        <span class="content__item__label">Lyrics</span>
        <div
          @click="getLyrics()"
          class="
            text-white text-sm
            bg-gray-700-spotify bg-opacity-50
            cursor-pointer
            p-2
            rounded-lg
            w-full
            sm:w-auto
          "
        >
          <template v-if="lyrics.status === 'idle'">Click to load</template>
          <template v-else-if="lyrics.status === 'loading'">
            Loading...
          </template>
          <template v-else>Failed to load</template>
          <pre v-show="lyrics.text" class="whitespace-pre-wrap">{{
            lyrics.text
          }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { addSeconds, format } from "date-fns";
import { getTrack, getTrackLyrics } from "@/api";
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
      lyrics: {
        status: "idle",
        text: "",
      },
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
  methods: {
    async getLyrics() {
      try {
        this.lyrics.status = "loading";
        this.lyrics.text = await getTrackLyrics({
          title: this.track.name,
          artist: this.track.artists[0].name,
        });
        this.lyrics.status = "success";
      } catch {
        this.lyrics.status = "failure";
      }
    },
  },
};
</script>
