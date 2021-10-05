<template>
  <loading-spinner v-if="loading" />
  <template v-else>
    <error-message v-if="error" />
    <container v-else>
      <figure class="responsive-picture">
        <base-img
          parallax
          :src="album.image"
          :alt="album.name"
          image-type="album"
          class="responsive-picture__image"
        />
        <figcaption class="responsive-picture__title">
          <spotify-link :link="`https://open.spotify.com/album/${album.id}`">
            {{ album.name }}
          </spotify-link>
        </figcaption>
      </figure>
      <cards>
        <card v-if="isLiked" title="❤">liked</card>
        <card :title="total_tracks">tracks amount</card>
      </cards>
      <container-item>
        <container-item-label>Audio features</container-item-label>
        <audio-features :audio-features="audioFeatures" />
      </container-item>
      <container-item v-if="genres.length">
        <container-item-label>Genres</container-item-label>
        <horizontal-scroll>
          <badge v-for="(genre, index) in genres" :key="index">
            {{ genre }}
          </badge>
        </horizontal-scroll>
      </container-item>
      <container-item>
        <container-item-label>Artists</container-item-label>
        <horizontal-scroll>
          <spotify-card
            v-for="item in album.artists"
            :key="item.id"
            :item="item"
            type="artist"
          />
        </horizontal-scroll>
      </container-item>
      <container-item v-if="tracksList.length">
        <container-item-label>Album content</container-item-label>
        <track-rows>
          <track-row
            v-for="(item, index) in tracksList"
            :key="index"
            plays-or-date="plays"
            :track="{
              ...item,
              album: false,
            }"
          />
        </track-rows>
      </container-item>
    </container>
  </template>
</template>

<script>
import { getAlbum } from "@/api";
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
    SpotifyLink,
    SpotifyCard,
    TrackRows,
    TrackRow,
    BaseImg,
    Badge,
    Cards,
    Card,
    ErrorMessage,
  },
  data() {
    return {
      loading: true,
      error: false,
      album: {},
      album_content: [],
      genres: [],
      audioFeatures: {},
      favouriteTracks: [],
      isLiked: false,
      total_tracks: null,
    };
  },
  computed: {
    tracksList() {
      const combinedTracks = [...this.album_content, ...this.favouriteTracks];
      let formattedTracks = [
        ...new Map(combinedTracks.map((item) => [item["id"], item])).values(),
      ];
      formattedTracks.map((track) => {
        if (!track.plays) track.plays = 0;
        if (!track.image) track.image = this.album.image;
      });
      formattedTracks.sort((a, b) => b.plays - a.plays);
      return formattedTracks;
    },
  },
  watch: {
    "$route.params.albumId": {
      handler: async function (newValue, oldValue) {
        if (!newValue || newValue === oldValue) return;
        try {
          this.loading = true;
          this.error = false;
          const response = await getAlbum(newValue);
          this.album = response.album;
          this.album_content = response.content;
          this.favouriteTracks = response.favouriteTracks;
          this.total_tracks = response.total_tracks;
          this.isLiked = response.isLiked;
          this.genres = response.genres;
          this.audioFeatures = response.audioFeatures;
          this.$meta.setTitle(this.album.name);
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
