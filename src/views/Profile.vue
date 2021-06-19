<template>
  <loading-spinner v-if="loading" />
  <template v-else>
    <div class="flex flex-col gap-4">
      <figure class="responsive-picture">
        <base-img
          :src="profile.avatar"
          :alt="profile.userName"
          class="responsive-picture__image"
        />
        <figcaption class="responsive-picture__title">
          <span
            class="text-white text-3xl sm:text-2xl md:text-3xl sm:font-medium font-semibold"
          >
            {{ profile.userName }}
          </span>
        </figcaption>
      </figure>
      <div class="content">
        <div class="mt-2 flex flex-wrap gap-2">
          <card :title="profile.overview.plays" subtitle="tracks played" />
          <card
            :title="profile.overview.playtime"
            subtitle="minutes listened"
          />
        </div>
        <div class="content__item" v-if="profile.genres.length">
          <span class="content__item__label">
            Genres
          </span>
          <div class="flex flex-wrap gap-2">
            <badge v-for="(genre, index) in profile.genres" :key="index">
              {{ genre }}
            </badge>
          </div>
        </div>
        <div class="flex flex-row items-center gap-x-12 gap-y-3 flex-wrap">
          <div class="content__item">
            <span class="content__item__label">
              Top Albums
            </span>
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
            <span class="content__item__label">
              Top Artists
            </span>
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
            <span class="content__item__label">
              Top Tracks
            </span>
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
        <div class="content__item">
          <span class="content__item__label">
            Listened tracks
          </span>
          <div class="flex flex-col gap-3">
            <div v-for="(item, index) in profile.history" :key="index">
              <router-link
                :to="{ name: 'track', params: { id: item.id } }"
                class="flex flex-row items-center gap-3 pr-3 hover:bg-gray-700-spotify duration-100 rounded-lg"
              >
                <base-img
                  :src="item.image"
                  :alt="item.name"
                  class="w-16 h-16 object-cover rounded-lg"
                />
                <div class="flex flex-col">
                  <div
                    class="text-white sm:w-full w-48 overflow-hidden truncate"
                  >
                    {{ item.name }}
                  </div>
                  <div
                    class="flex flex-row text-sm sm:w-full w-48 items-center overflow-hidden truncate"
                  >
                    <multi-router
                      color="text-gray-400-spotify"
                      :routes="item.artists"
                    />
                  </div>
                  <div class="text-gray-500-spotify text-sm font-normal">
                    {{ getDateFromNow(item.played_at) }}
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
      </div>
    </div>
  </template>
</template>

<script>
import { getProfile } from "@/api";
import BaseImg from "@/components/BaseImg.vue";
import Card from "@/components/Card.vue";
import Badge from "@/components/Badge.vue";
import MultiRouter from "@/components/MultiRouter.vue";
import { formatDistanceToNowStrict } from "date-fns";

export default {
  components: { BaseImg, Card, Badge, MultiRouter },
  methods: {
    getDateFromNow(date) {
      return formatDistanceToNowStrict(Date.parse(date), {
        addSuffix: true,
      });
    },
  },
  data() {
    return {
      loading: true,
      profile: {},
    };
  },
  async created() {
    try {
      this.profile = await getProfile(this.$route.params.id);
      document.title = `${this.profile.userName} - Spotiworm`;
      this.loading = false;
      console.log(this.profile);
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
