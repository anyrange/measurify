<template>
  <loading-spinner v-if="loading" />
  <template v-else>
    <error-message v-if="error" />
    <container v-else>
      <figure class="responsive-picture">
        <base-img
          parallax
          image-type="artist"
          :src="artist.image"
          :alt="artist.name"
          class="responsive-picture__image"
        />
        <figcaption class="responsive-picture__title">
          <spotify-link :link="`https://open.spotify.com/artist/${artist.id}`">
            {{ artist.name }}
          </spotify-link>
        </figcaption>
      </figure>
      <cards>
        <card v-if="isLiked" title="❤">following</card>
        <card :title="followers">followers</card>
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
          <a
            class="text-green-500-spotify font-bold cursor-pointer"
            @click="
              currentItem = rate[0];
              modalOpened = true;
            "
          >
            {{ artist.name }}
          </a>
          appeared in top 50 tracks
          {{
            rate[0] === "LT"
              ? $options.PERIODS[rate[0]]
              : "from the " + $options.PERIODS[rate[0]]
          }}
        </card>
      </cards>
      <container-item>
        <container-item-label>Audio features</container-item-label>
        <audio-features :audioFeatures="audioFeatures" />
      </container-item>
      <container-item>
        <container-item-label>Genres</container-item-label>
        <horizontal-scroll>
          <badge v-for="(genre, index) in genres" :key="index">
            {{ genre }}
          </badge>
        </horizontal-scroll>
      </container-item>
      <container-item>
        <container-item-label>Albums</container-item-label>
        <horizontal-scroll>
          <spotify-card
            v-for="item in albums"
            :key="item.id"
            :item="item"
            type="album"
          />
        </horizontal-scroll>
      </container-item>
      <container-item v-if="favouriteTracks.length">
        <container-item-label>Favourite tracks</container-item-label>
        <track-rows>
          <track-row
            v-for="(item, index) in favouriteTracks"
            :key="index"
            :track="item"
            :place="index + 1"
          />
        </track-rows>
      </container-item>
      <modal :show="modalOpened" @close="modalOpened = false">
        <div class="flex flex-col gap-3 p-3">
          <div class="flex flex-col gap-1">
            <h3 class="sm:text-2xl text-xl font-semibold">
              Most streamed tracks
            </h3>
            <span class="text-gray-500-spotify">
              The amount of times a track by {{ artist.name }} appears in your
              top
              <strong>
                {{
                  currentItem === "LT"
                    ? $options.PERIODS[currentItem]
                    : "in the " + $options.PERIODS[currentItem]
                }}
              </strong>
            </span>
          </div>
          <hr />
          <div class="flex flex-col gap-y-2">
            <div
              class="flex flex-row items-end gap-x-2 text-base"
              v-for="(track, index) in tracksOfSelectedTerm"
              :key="index"
            >
              <span class="text-gray-500-spotify">#{{ track.place }}</span>
              <router-link
                class="link"
                :to="{ name: 'track', params: { trackId: track.id } }"
              >
                {{ track.name }}
              </router-link>
            </div>
          </div>
        </div>
      </modal>
    </container>
  </template>
</template>

<script>
import { getArtist } from "@/api";

import Container from "@/components/Container.vue";
import ContainerItem from "@/components/ContainerItem.vue";
import ContainerItemLabel from "@/components/ContainerItemLabel.vue";
import HorizontalScroll from "@/components/HorizontalScroll.vue";
import AudioFeatures from "@/components/AudioFeatures.vue";
import SpotifyLink from "@/components/SpotifyLink.vue";
import SpotifyCard from "@/components/SpotifyCard.vue";
import TrackRows from "@/components/TrackRows.vue";
import TrackRow from "@/components/TrackRow.vue";
import BaseImg from "@/components/BaseImg.vue";
import Modal from "@/components/Modal.vue";
import Badge from "@/components/Badge.vue";
import Cards from "@/components/Cards.vue";
import Card from "@/components/Card.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";

export default {
  components: {
    Container,
    ContainerItem,
    ContainerItemLabel,
    HorizontalScroll,
    AudioFeatures,
    SpotifyCard,
    SpotifyLink,
    TrackRows,
    TrackRow,
    BaseImg,
    Modal,
    Badge,
    Cards,
    Card,
    ErrorMessage,
  },
  data() {
    return {
      loading: true,
      error: false,
      artist: {},
      rates: {},
      genres: [],
      audioFeatures: {},
      favouriteTracks: [],
      albums: [],
      currentItem: {},
      isLiked: false,
      followers: 0,
      modalOpened: false,
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
  watch: {
    "$route.params.artistId": {
      handler: async function (newValue, oldValue) {
        if (!newValue || newValue === oldValue) return;
        try {
          this.loading = true;
          this.error = false;
          const response = await getArtist(newValue);
          this.artist = response.artist;
          this.albums = response.albums;
          this.favouriteTracks = response.favouriteTracks;
          this.genres = response.genres;
          this.link = response.link;
          this.isLiked = response.isLiked;
          this.rates = response.rates;
          this.followers = response.followers;
          this.audioFeatures = response.audioFeatures;
          this.$meta.setTitle(this.artist.name);
        } catch (error) {
          this.error = true;
        } finally {
          this.loading = false;
        }
      },
      immediate: true,
    },
  },
};
</script>
