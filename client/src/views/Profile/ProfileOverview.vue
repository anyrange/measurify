<template>
  <container>
    <cards>
      <card :title="profile.overview.plays">tracks played</card>
      <card :title="profile.overview.playtime">minutes listened</card>
      <card :title="formatDate(profile.user.registrationDate)">joined</card>
    </cards>
    <container-item v-if="profile.genres.length">
      <container-item-label>
        <router-link to="/" class="link">Genres</router-link>
      </container-item-label>
      <horizontal-scroll>
        <badge v-for="genre in profile.genres" :key="genre">{{ genre }}</badge>
      </horizontal-scroll>
    </container-item>
    <container-item v-if="profile.history.length">
      <container-item-label>
        <router-link to="/" class="link">Recent Tracks</router-link>
      </container-item-label>
      <track-rows>
        <track-row
          v-for="(item, index) in profile.history.slice(0, 5)"
          :key="index + item.id"
          :track="item"
        />
      </track-rows>
    </container-item>
    <container-item v-if="profile.top.artists.length">
      <container-item-label>
        <router-link to="/" class="link">Favourite Artists</router-link>
      </container-item-label>
      <horizontal-scroll>
        <spotify-card
          v-for="item in profile.top.artists"
          :key="item.id"
          :item="item"
          type="artist"
        />
      </horizontal-scroll>
    </container-item>
    <container-item v-if="profile.top.albums.length">
      <container-item-label>
        <router-link to="/" class="link">Favourite Albums</router-link>
      </container-item-label>
      <horizontal-scroll>
        <spotify-card
          v-for="item in profile.top.albums"
          :key="item.id"
          :item="item"
          type="album"
        />
      </horizontal-scroll>
    </container-item>
    <container-item v-if="profile.top.tracks.length">
      <container-item-label>
        <router-link to="/" class="link">Favourite Tracks</router-link>
      </container-item-label>
      <track-rows>
        <track-row
          v-for="(item, index) in profile.top.tracks"
          :key="index"
          :track="item"
          :place="index + 1"
        />
      </track-rows>
    </container-item>
  </container>
</template>

<script>
import { mapState } from "vuex";
import { formatDate } from "@/utils/formatters";
import Container from "@/components/Container";
import ContainerItem from "@/components/ContainerItem";
import ContainerItemLabel from "@/components/ContainerItemLabel";
import HorizontalScroll from "@/components/HorizontalScroll";
import SpotifyCard from "@/components/SpotifyCard";
import TrackRows from "@/components/TrackRows";
import TrackRow from "@/components/TrackRow";
import Badge from "@/components/Badge";
import Cards from "@/components/Cards";
import Card from "@/components/Card";

export default {
  components: {
    Container,
    ContainerItem,
    ContainerItemLabel,
    HorizontalScroll,
    SpotifyCard,
    TrackRows,
    TrackRow,
    Badge,
    Cards,
    Card,
  },
  computed: {
    ...mapState({
      profile: (state) => state.profile.profile,
    }),
  },
  methods: {
    formatDate,
  },
};
</script>
