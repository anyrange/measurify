<template>
  <loading-spinner v-if="loading" />
  <template v-else>
    <div class="flex flex-col gap-4">
      <div class="flex flex-row items-center gap-4">
        <base-img
          avatar
          :src="profile.avatar"
          :alt="profile.userName"
          class="
            flex flex-none
            rounded-full
            sm:rounded-lg
            w-20
            h-20
            sm:w-48
            sm:h-48
            object-cover
            duration-300
          "
        />
        <span
          class="
            text-white
            truncate-2
            sm:text-3xl
            text-2xl
            sm:font-medium
            font-semibold
          "
        >
          {{ profile.userName }}
        </span>
      </div>
      <div class="content">
        <div class="mt-2 flex flex-wrap gap-2">
          <card :title="profile.overview.plays">tracks played</card>
          <card :title="profile.overview.playtime">minutes listened</card>
        </div>
        <div class="content__item" v-if="profile.genres.length">
          <span class="content__item__label"> Genres </span>
          <div class="flex flex-wrap gap-2">
            <badge v-for="(genre, index) in profile.genres" :key="index">
              {{ genre }}
            </badge>
          </div>
        </div>
        <div class="flex flex-row items-center gap-x-12 gap-y-3 flex-wrap">
          <div class="content__item">
            <span class="content__item__label"> Top Albums </span>
            <div class="content__item__boxes">
              <router-link
                class="link"
                v-for="(item, index) in profile.top.albums"
                :key="index"
                :to="{ name: 'album', params: { id: item.id } }"
              >
                <div class="content__item__boxes__box">
                  <base-img
                    :src="item.image"
                    :alt="item.name"
                    class="content__item__boxes__box__image"
                  />
                  <div class="content__item__boxes__box__label">
                    {{ item.name }}
                  </div>
                </div>
              </router-link>
            </div>
          </div>
          <div class="content__item">
            <span class="content__item__label"> Top Artists </span>
            <div class="content__item__boxes">
              <router-link
                class="link"
                v-for="(item, index) in profile.top.artists"
                :key="index"
                :to="{ name: 'artist', params: { id: item.id } }"
              >
                <div class="content__item__boxes__box">
                  <base-img
                    :src="item.image"
                    :alt="item.name"
                    class="content__item__boxes__box__image"
                  />
                  <div class="content__item__boxes__box__label">
                    {{ item.name }}
                  </div>
                </div>
              </router-link>
            </div>
          </div>
          <div class="content__item">
            <span class="content__item__label"> Top Tracks </span>
            <div class="content__item__boxes">
              <router-link
                class="link"
                v-for="(item, index) in profile.top.tracks"
                :key="index"
                :to="{ name: 'track', params: { id: item.id } }"
              >
                <div class="content__item__boxes__box">
                  <base-img
                    :src="item.image"
                    :alt="item.name"
                    class="content__item__boxes__box__image"
                  />
                  <div class="content__item__boxes__box__label">
                    {{ item.name }}
                  </div>
                </div>
              </router-link>
            </div>
          </div>
        </div>
        <!-- <div class="content__item">
          <span class="content__item__label">
            Top Playlists
          </span>
          <div class="content__item__boxes">
            <router-link
              class="link"
              v-for="(item, index) in profile.top.playlists"
              :key="index"
              :to="{ name: 'playlists', params: { id: item.id } }"
            >
              <div class="content__item__boxes__box">
                <base-img
                  :src="item.image"
                  :alt="item.name"
                  class="content__item__boxes__box__image"
                />
                <div class="content__item__boxes__box__label">
                  {{ item.name }}
                </div>
              </div>
            </router-link>
          </div>
        </div> -->
        <div class="content__item">
          <span class="content__item__label"> Hourly activity </span>
          <div
            class="
              flex
              md:flex-row
              flex-col
              text-center
              -mx-10
              font-medium
              text-base text-gray-400-spotify
            "
          >
            <div>
              AM
              <apexchart
                type="polarArea"
                :options="chartOptions"
                :series="activityHours.AM"
              ></apexchart>
            </div>
            <div>
              PM
              <apexchart
                type="polarArea"
                :options="chartOptions"
                :series="activityHours.PM"
              ></apexchart>
            </div>
          </div>
        </div>
        <div class="content__item">
          <span class="content__item__label"> Listened tracks </span>
          <tracks-list :tracks="profile.history" />
        </div>
      </div>
    </div>
  </template>
</template>

<script>
import { getProfile } from "@/api";
import BaseImg from "@/components/BaseImg.vue";
import Card from "@/components/Card.vue";
import Badge from "@/components/Badge.vue";
import VueApexCharts from "vue3-apexcharts";
import TracksList from "@/components/TracksList.vue";

export default {
  components: {
    BaseImg,
    Card,
    Badge,
    TracksList,
    apexchart: VueApexCharts,
  },
  data() {
    return {
      loading: true,
      profile: {},
      series: [],
      chartOptions: {
        chart: {
          type: "polarArea",
        },
        labels: [
          "1:00",
          "2:00",
          "3:00",
          "4:00",
          "5:00",
          "6:00",
          "7:00",
          "8:00",
          "9:00",
          "10:00",
          "11:00",
          "12:00",
        ],
        fill: {},
        plotOptions: {
          polarArea: {
            rings: {
              strokeWidth: 0,
            },
            spokes: {
              strokeWidth: 1,
              connectorColors: "#282828",
            },
          },
        },
        stroke: {
          width: 1,
        },
        yaxis: {
          show: false,
        },
        legend: {
          show: false,
        },
        theme: {
          monochrome: {
            enabled: true,
            color: "#1eb252",
            shadeTo: "dark",
            shadeIntensity: 0,
          },
        },
      },
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
