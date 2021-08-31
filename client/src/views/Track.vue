<template>
  <loading-spinner v-if="loading" />
  <container v-else>
    <figure class="responsive-picture">
      <base-img
        parallax
        :src="track.image"
        :alt="track.name"
        image-type="track"
        class="responsive-picture__image"
      />
      <figcaption class="responsive-picture__title">
        <spotify-link :link="`https://open.spotify.com/track/${track.id}`">
          {{ track.name }}
        </spotify-link>
      </figcaption>
    </figure>
    <cards>
      <card v-if="isLiked" title="❤">liked</card>
      <card :title="getDuration(duration_ms)">track length</card>
      <card :title="formatDate(release_date)">release date</card>
      <card v-if="overview.playtime" :title="overview.playtime">
        minutes listened
      </card>
      <card v-if="overview.plays" :title="overview.plays"> times played </card>
      <card
        v-for="(rate, index) in filteredTrackRates"
        :title="'#' + rate[1]"
        :key="index"
      >
        of your most streamed tracks {{ $options.PERIODS[rate[0]] }}
      </card>
    </cards>
    <container-item>
      <container-item-label>Audio features</container-item-label>
      <audio-features :audioFeatures="audioFeatures" />
    </container-item>
    <container-item>
      <container-item-label>Album</container-item-label>
      <horizontal-scroll>
        <spotify-card :item="track.album" type="album" />
      </horizontal-scroll>
    </container-item>
    <container-item>
      <container-item-label>Artists</container-item-label>
      <horizontal-scroll>
        <spotify-card
          v-for="item in track.artists"
          :key="item.id"
          :item="item"
          type="artist"
        />
      </horizontal-scroll>
    </container-item>
    <container-item>
      <container-item-label>Lyrics</container-item-label>
      <div
        @click="getLyrics()"
        class="
          text-white text-sm
          bg-gray-700-spotify bg-opacity-20
          hover:bg-gray-700-spotify hover:bg-opacity-30
          duration-75
          shadow-md
          p-2
          rounded
          w-full
          sm:w-auto
        "
        :class="[lyrics.text ? 'pointer-events-none' : 'cursor-pointer']"
      >
        <span v-if="lyrics.status === 'idle'" class="flex gap-2 items-center">
          <lyrics-icon class="h-10 w-10" />
          Click to load
        </span>
        <template v-else-if="lyrics.status === 'loading'">
          Loading...
        </template>
        <template v-else-if="lyrics.status === 'failure'">
          Failed to load
        </template>
        <pre
          v-else
          class="whitespace-pre-wrap font-sans"
          v-html="lyrics.text || 'Lyrics not found'"
        />
      </div>
    </container-item>
  </container>
</template>

<script>
import { getTrack, getTrackLyrics } from "@/api";
import { formatDate, getDuration } from "@/utils/formatters";
import { LyricsIcon } from "@/components/icons";
import Container from "@/components/Container";
import ContainerItem from "@/components/ContainerItem";
import ContainerItemLabel from "@/components/ContainerItemLabel";
import HorizontalScroll from "@/components/HorizontalScroll";
import AudioFeatures from "@/components/AudioFeatures";
import SpotifyCard from "@/components/SpotifyCard";
import SpotifyLink from "@/components/SpotifyLink";
import BaseImg from "@/components/BaseImg";
import Cards from "@/components/Cards";
import Card from "@/components/Card";

export default {
  components: {
    LyricsIcon,
    Container,
    ContainerItem,
    ContainerItemLabel,
    HorizontalScroll,
    AudioFeatures,
    SpotifyCard,
    SpotifyLink,
    BaseImg,
    Cards,
    Card,
  },
  data() {
    return {
      loading: true,
      track: {},
      rates: {},
      overview: {},
      audioFeatures: {},
      release_date: null,
      duration_ms: 0,
      selectedPeriod: "alltime",
      lyrics: { status: "idle", text: "" },
    };
  },
  PERIODS: {
    LT: "lifetime",
    MT: "past 6 months",
    ST: "past 4 weeks",
  },
  computed: {
    filteredTrackRates() {
      return Object.entries(this.rates).filter((item) => item[1]);
    },
  },
  async created() {
    try {
      const response = await getTrack(this.$route.params.id);
      this.track = response.track;
      this.release_date = response.release_date;
      this.duration_ms = response.duration_ms;
      this.rates = response.rates;
      this.isLiked = response.isLiked;
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
    getDuration,
    formatDate,
    async getLyrics() {
      try {
        this.lyrics.status = "loading";
        this.lyrics.text = await getTrackLyrics({
          title: this.track.name,
          artist: this.track.artists[0].name,
        }).then((res) => res.lyrics);
        this.lyrics.status = "success";
      } catch {
        this.lyrics.status = "failure";
      }
    },
  },
};
</script>
