<template>
  <loading-spinner v-if="loading" />
  <template v-else>
    <info-message v-if="error" type="error" />
    <container v-else>
      <figure class="responsive-picture">
        <base-img
          parallax
          :src="trackData.track.image"
          :alt="trackData.track.name"
          image-type="track"
          class="responsive-picture__image"
        />
        <figcaption class="responsive-picture__title">
          <spotify-link
            :link="`https://open.spotify.com/track/${trackData.track.id}`"
          >
            {{ trackData.track.name }}
          </spotify-link>
        </figcaption>
      </figure>
      <cards>
        <card v-if="trackData.isLiked" title="❤">liked</card>
        <card :title="getDuration(trackData.duration_ms)">track length</card>
        <card :title="formatDate(trackData.release_date)">release date</card>
        <card
          v-if="trackData.overview.playtime"
          :title="trackData.overview.playtime"
        >
          minutes listened
        </card>
        <card v-if="trackData.overview.plays" :title="trackData.overview.plays">
          times played
        </card>
        <card
          v-for="(rate, index) in filteredTrackRates"
          :key="index"
          :title="'#' + rate[1]"
        >
          of your most streamed tracks {{ PERIODS[rate[0]] }}
        </card>
      </cards>
      <container-item>
        <container-item-label>Audio features</container-item-label>
        <audio-features :audio-features="trackData.audioFeatures" />
      </container-item>
      <container-item>
        <container-item-label>Album</container-item-label>
        <horizontal-scroll>
          <spotify-card :item="trackData.track.album" type="album" />
        </horizontal-scroll>
      </container-item>
      <container-item>
        <container-item-label>Artists</container-item-label>
        <horizontal-scroll>
          <spotify-card
            v-for="item in trackData.track.artists"
            :key="item.id"
            :item="item"
            type="artist"
          />
        </horizontal-scroll>
      </container-item>
      <container-item>
        <container-item-label>Lyrics</container-item-label>
        <div v-if="!lyrics.text && lyrics.status !== 'success'">
          <base-button color="dark" @click="getLyrics">
            {{ lyricsStates[lyrics.status] }}
          </base-button>
        </div>
        <!-- eslint-disable vue/no-v-html -->
        <div
          v-else
          class="
            text-white text-sm
            bg-gray-700-spotify bg-opacity-20
            duration-75
            shadow-md
            p-2
            rounded
            w-full
            sm:w-auto
          "
        >
          <pre
            class="whitespace-pre-wrap font-sans"
            v-html="lyrics.text || 'Lyrics not found'"
          />
        </div>
      </container-item>
      <container-item>
        <container-item-label>
          More tracks by
          <router-link
            class="link"
            :to="{
              name: 'artist',
              params: {
                artistId: trackData.track.artists[0].id,
              },
            }"
          >
            {{ trackData.track.artists[0].name }}
          </router-link>
        </container-item-label>
        <track-rows>
          <track-row
            v-for="(item, index) in trackData.moreTracks"
            :key="index"
            :track="item"
            :plays-or-date="false"
          />
        </track-rows>
      </container-item>
    </container>
  </template>
</template>

<script setup>
import { computed } from "vue";
import { useTrack } from "@/composable/useTrack";
import { formatDate, getDuration } from "@/utils";
import PERIODS from "@/assets/configs/periods.json";

const lyricsStates = {
  idle: "Load lyrics",
  loading: "Loading...",
  failure: "Failed to load",
};

const { trackData, loading, error, lyrics, getLyrics } = useTrack();

const filteredTrackRates = computed(() =>
  Object.entries(trackData.value.rates).filter((item) => item[1])
);
</script>
