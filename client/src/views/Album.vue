<template>
  <loading-spinner v-if="loading" />
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
      <audio-features :audioFeatures="audioFeatures" />
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
  </container>
</template>

<script>
import { getAlbum } from "@/api";
import Container from "@/components/Container";
import ContainerItem from "@/components/ContainerItem";
import ContainerItemLabel from "@/components/ContainerItemLabel";
import HorizontalScroll from "@/components/HorizontalScroll";
import AudioFeatures from "@/components/AudioFeatures";
import SpotifyLink from "@/components/SpotifyLink";
import SpotifyCard from "@/components/SpotifyCard";
import TrackRows from "@/components/TrackRows";
import TrackRow from "@/components/TrackRow";
import BaseImg from "@/components/BaseImg";
import Badge from "@/components/Badge";
import Cards from "@/components/Cards";
import Card from "@/components/Card";

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
  },
  data() {
    return {
      loading: true,
      album: {},
      genres: [],
      audioFeatures: {},
      favouriteTracks: [],
      isLiked: false,
      total_tracks: null,
    };
  },
  async created() {
    try {
      const response = await getAlbum(this.$route.params.id);
      this.album = response.album;
      this.favouriteTracks = response.favouriteTracks;
      this.total_tracks = response.total_tracks;
      this.isLiked = response.isLiked;
      this.genres = response.genres;
      this.audioFeatures = response.audioFeatures;
      document.title = `${this.album.name} - Spotiworm`;
    } catch (error) {
      this.$router.push({ name: "home" });
    } finally {
      this.loading = false;
    }
  },
};
</script>
