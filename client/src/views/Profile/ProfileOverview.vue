<template>
  <container>
    <cards>
      <card :title="profile.overview.plays">tracks played</card>
      <card :title="profile.overview.playtime">minutes listened</card>
      <card :title="formatDate(profile.user.registrationDate)">joined</card>
      <card :title="profile.user.country">country</card>
    </cards>
    <container-item v-if="profile.genres.length">
      <container-item-label>
        <router-link :to="{ name: 'profile-reports' }" class="link">
          Genres
        </router-link>
      </container-item-label>
      <horizontal-scroll>
        <badge v-for="genre in profile.genres" :key="genre">{{ genre }}</badge>
      </horizontal-scroll>
    </container-item>
    <container-item v-if="profile.history.length">
      <container-item-label>
        <router-link :to="{ name: 'profile-history' }" class="link">
          Recent Tracks
        </router-link>
      </container-item-label>
      <track-rows>
        <current-track />
        <track-row
          v-for="(item, index) in profile.history.slice(0, 5)"
          :key="index + item.id"
          :track="item"
          plays-or-date="date"
        />
      </track-rows>
    </container-item>
    <container-item v-if="profile.top.artists.length">
      <container-item-label>
        <router-link :to="{ name: 'profile-library' }" class="link">
          Favourite Artists
        </router-link>
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
        <router-link :to="{ name: 'profile-library' }" class="link">
          Favourite Albums
        </router-link>
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
        <router-link :to="{ name: 'profile-library' }" class="link">
          Favourite Tracks
        </router-link>
      </container-item-label>
      <track-rows>
        <track-row
          v-for="(item, index) in profile.top.tracks"
          :key="index"
          :track="item"
          :place="index + 1"
          plays-or-date="plays"
        />
      </track-rows>
    </container-item>
  </container>
</template>

<script>
import { mapState } from "vuex";
import { formatDate } from "@/utils/formatters";
import Container from "@/components/Container.vue";
import ContainerItem from "@/components/ContainerItem.vue";
import ContainerItemLabel from "@/components/ContainerItemLabel.vue";
import HorizontalScroll from "@/components/HorizontalScroll.vue";
import SpotifyCard from "@/components/SpotifyCard.vue";
import TrackRows from "@/components/TrackRows.vue";
import TrackRow from "@/components/TrackRow.vue";
import Badge from "@/components/Badge.vue";
import Cards from "@/components/Cards.vue";
import Card from "@/components/Card.vue";
import CurrentTrack from "@/components/CurrentTrack.vue";

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
    CurrentTrack,
  },
  computed: {
    ...mapState({
      profile: (state) => state.profile.profile,
    }),
  },
  activated() {
    this.$meta.setTitle(
      `${this.profile.user.display_name} (@${this.profile.user.username})`
    );
  },
  methods: {
    formatDate,
  },
};
</script>
