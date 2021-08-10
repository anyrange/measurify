<template>
  <loading-spinner v-if="loading" />
  <div v-else class="w-ful flex flex-col gap-4">
    <div class="w-full flex flex-row items-center gap-4">
      <base-img
        avatar
        :src="profile.avatar"
        :alt="profile.userName"
        class="
          flex flex-none
          object-cover
          rounded-full
          sm:rounded-lg
          w-20
          h-20
          sm:w-48
          sm:h-48
          duration-300
        "
      />
      <spotify-link
        :link="`https://open.spotify.com/user/${profile.spotifyID}`"
      >
        {{ profile.userName }}
      </spotify-link>
    </div>
    <div class="content">
      <div class="content-cards">
        <card :title="profile.overview.plays">tracks played</card>
        <card :title="profile.overview.playtime">minutes listened</card>
      </div>
      <div class="content__item -mt-4" v-if="profile.genres.length">
        <span class="content__item__label">Genres</span>
        <div class="flex flex-wrap gap-2">
          <badge v-for="genre in profile.genres" :key="genre">
            {{ genre }}
          </badge>
        </div>
      </div>
      <!-- Tops -->
      <div class="content-tops">
        <div class="fullwidth">
          <div class="content-top">
            <span class="content__item__label">Favourite Albums</span>
            <div class="content-top__items">
              <spotify-box
                v-for="item in profile.top.albums"
                :key="item.id"
                :item="item"
                type="album"
              />
            </div>
          </div>
        </div>
        <div class="fullwidth">
          <div class="content-top">
            <span class="content__item__label">Favourite Artists</span>
            <div class="content-top__items">
              <spotify-box
                v-for="item in profile.top.artists"
                :key="item.id"
                :item="item"
                type="artist"
              />
            </div>
          </div>
        </div>
        <div class="fullwidth">
          <div class="content-top">
            <span class="content__item__label">Favourite Tracks</span>
            <div class="content-top__items">
              <spotify-box
                v-for="item in profile.top.tracks"
                :key="item.id"
                :item="item"
                type="track"
              />
            </div>
          </div>
        </div>
        <div class="fullwidth">
          <div class="content-top">
            <span class="content__item__label">Favourite Playlists</span>
            <div class="content-top__items">
              <spotify-box
                v-for="item in profile.top.playlists"
                :key="item.id"
                :item="item"
                type="playlist"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--  -->
    <div class="content__item">
      <span class="content__item__label">Hourly activity</span>
      <tabs v-if="isMobile" v-model="timePeriod">
        <tab name="pm">PM</tab>
        <tab name="am">AM</tab>
      </tabs>
      <div
        class="
          flex flex-col
          lg:flex-row
          text-center text-base text-gray-400-spotify
          font-medium
          -mx-12
          -mb-4
          -mt-2
        "
      >
        <div
          class="flex-shrink-0"
          v-if="!isMobile || (isMobile && timePeriod === 'am')"
        >
          <span v-show="!isMobile">AM</span>
          <apexchart
            type="polarArea"
            :options="chartOptions"
            :series="activityHours.AM"
          ></apexchart>
        </div>
        <div
          class="flex-shrink-0"
          v-if="!isMobile || (isMobile && timePeriod === 'pm')"
        >
          <span v-show="!isMobile">PM</span>
          <apexchart
            type="polarArea"
            :options="chartOptions"
            :series="activityHours.PM"
          ></apexchart>
        </div>
      </div>
      <div class="content__item">
        <span class="content__item__label">Listened tracks</span>
        <tracks-list :tracks="profile.history" />
      </div>
    </div>
  </div>
</template>

<script>
import { getProfile } from "@/api";
import BaseImg from "@/components/BaseImg.vue";
import Card from "@/components/Card.vue";
import Badge from "@/components/Badge.vue";
import TracksList from "@/components/TracksList.vue";
import SpotifyLink from "@/components/SpotifyLink.vue";
import SpotifyBox from "@/components/SpotifyBox.vue";
import Tabs from "@/components/Tabs";
import Tab from "@/components/Tab";
import VueApexCharts from "vue3-apexcharts";
import activityHoursChart from "@/mixins/activityHoursChart";

export default {
  components: {
    BaseImg,
    Card,
    Tabs,
    Tab,
    Badge,
    TracksList,
    SpotifyLink,
    SpotifyBox,
    apexchart: VueApexCharts,
  },
  mixins: [activityHoursChart],
  data() {
    return {
      loading: true,
      profile: {},
      timePeriod: "pm",
    };
  },
  computed: {
    activityHours() {
      const activity = this.profile.hourlyActivity.map((item) => item.plays);
      const hourOffset = new Date().getTimezoneOffset() / 60;
      if (hourOffset < 0) {
        const shift = activity.splice(hourOffset, Math.abs(hourOffset));
        activity.unshift(...shift);
      } else {
        const shift = activity.splice(0, hourOffset);
        activity.push(...shift);
      }
      return {
        AM: activity.slice(0, 12),
        PM: activity.slice(12),
      };
    },
    activityLabels() {
      return this.profile.hourlyActivity.map((item) => item.time);
    },
  },
  async created() {
    try {
      this.profile = await getProfile(this.$route.params.id);
      document.title = `${this.profile.userName} - Spotiworm`;
      this.loading = false;
    } catch (error) {
      this.$router.push({ name: "home" });
    }
  },
};
</script>

<style lang="postcss" scoped>
.badge {
  @apply bg-gray-700-spotify w-52 p-2 rounded-full flex items-center flex-row justify-between;
}
.badge-title {
  @apply text-xl text-gray-400-spotify ml-2;
}
.badge-text {
  @apply text-2xl font-semibold text-gray-100 leading-tight mr-2;
}
</style>
