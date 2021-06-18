<template>
  <h2 class="h-title">Listening History</h2>
  <h3 class="h-subtitle mt-4 mb-4">
    Click the song's title, artist, or album name to get more info
  </h3>
  <base-input
    v-model="searchQuery"
    class="sm:w-full md:w-3/4 lg:w-1/2"
    placeholder="Search"
    type="text"
    iconLeft
    :disabled="!searchQuery && emptyData && !loading"
  >
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path
        d="M16.32 14.9l5.39 5.4a1 1 0 01-1.42 1.4l-5.38-5.38a8 8 0 111.41-1.41zM10 16a6 6 0 100-12 6 6 0 000 12z"
      />
    </svg>
  </base-input>
  <loading-spinner v-if="loading" />
  <template v-else>
    <empty-message v-if="emptyData" />
    <template v-else>
      <infinite-scroll @load="onScroll" :offset="350">
        <table class="mt-4 w-full table-fixed history-table">
          <thead>
            <tr>
              <th class="row-head row-title">Title</th>
              <th class="row-head row-artist">Artist</th>
              <th class="row-head row-album">Album</th>
              <th class="row-head row-when">When</th>
              <th class="row-head row-duration">Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(track, index) in recentlyPlayed || []"
              :key="index"
              class="hover:bg-gray-700-spotify"
            >
              <td class="row row-title">
                <router-link
                  class="hover:underline"
                  :to="{ name: 'track', params: { id: track.id } }"
                >
                  {{ track.name }}
                </router-link>
              </td>
              <td class="row row-artist">
                <template v-for="(artist, index) in track.artists" :key="index">
                  <router-link
                    class="hover:underline"
                    :to="{ name: 'artist', params: { id: artist.id } }"
                  >
                    {{ artist.name }}
                  </router-link>
                  <span v-if="index !== track.artists.length - 1">, </span>
                </template>
              </td>
              <td class="row row-album">
                <router-link
                  class="hover:underline"
                  :to="{ name: 'album', params: { id: track.album.id } }"
                >
                  {{ track.album.name }}
                </router-link>
              </td>
              <td class="row row-when">
                {{ getDateFromNow(track.played_at) }}
              </td>
              <td class="row row-duration">
                {{ getDuration(track.duration_ms) }}
              </td>
            </tr>
          </tbody>
        </table>
      </infinite-scroll>
      <div v-if="loadingNextPage" class="leading-8 skeleton w-full">
        &nbsp;
      </div>
    </template>
  </template>
</template>

<script>
import { formatDistanceToNowStrict, addSeconds, format } from "date-fns";
import { getListeningHistory } from "@/api";
import EmptyMessage from "@/components/EmptyMessage";
import BaseInput from "@/components/BaseInput";
import InfiniteScroll from "@/components/InfiniteScroll";

export default {
  name: "History",
  components: { EmptyMessage, BaseInput, InfiniteScroll },
  data() {
    return {
      recentlyPlayed: [],
      pagesMax: 1,
      page: 1,
      searchQuery: "",
      lastSuccessQuery: "",
      loading: true,
      loadingNextPage: false,
      emptyData: false,
    };
  },
  methods: {
    getDateFromNow(date) {
      return formatDistanceToNowStrict(Date.parse(date), {
        addSuffix: true,
      });
    },
    getDuration(time) {
      return format(addSeconds(new Date(0), time / 1000), "mm:ss");
    },
    async onScroll() {
      if (!this.loadingNextPage && this.page < this.pagesMax) {
        this.page++;
        this.loadingNextPage = true;
        const response = await getListeningHistory({
          page: this.page,
          query: this.searchQuery,
        });
        this.recentlyPlayed.push(...response.history);
        this.loadingNextPage = false;
      }
    },
  },
  watch: {
    searchQuery: {
      handler: async function() {
        this.page = 1;
        this.loading = true;

        if (
          this.emptyData &&
          this.lastSuccessQuery.length < this.searchQuery.length
        ) {
          return (this.loading = false);
        }

        const response = await getListeningHistory({
          page: this.page,
          query: this.searchQuery,
        });
        this.loading = false;

        if (response.status === 204) return (this.emptyData = true);

        this.emptyData = false;
        this.lastSuccessQuery = this.searchQuery;
        this.pagesMax = response.pages;
        this.recentlyPlayed = response.history;
      },
      immediate: true,
    },
  },
};
</script>

<style lang="postcss" scoped>
.history-table .row-head {
  @apply px-4 py-3 text-left border-b border-gray-700-spotify font-normal text-sm capitalize leading-4;
}
.history-table .row {
  @apply px-4 py-2 text-left border-b border-gray-700-spotify text-sm leading-5 text-gray-100 overflow-ellipsis overflow-hidden whitespace-nowrap;
}
.history-table .row-title {
  @apply md:w-3/10 w-1.5/10;
}
.history-table .row-artist {
  @apply w-2.5/10 sm:table-cell hidden;
}
.history-table .row-album {
  @apply w-2/10 md:table-cell hidden;
}
.history-table .row-when {
  @apply md:w-1.5/10 w-1/10;
}
.history-table .row-duration {
  @apply w-1/10 lg:table-cell hidden;
}
.skeleton {
  --text-opacity: 0;
  background-image: linear-gradient(
    100deg,
    #181818 0%,
    #282828 20%,
    #181818 40%
  );
  background-position: 50%;
  background-size: 200%;
  animation: skeleton 1.25s infinite linear;
}
@keyframes skeleton {
  0% {
    background-position: 50%;
  }
  50%,
  100% {
    background-position: -100%;
  }
}
</style>
