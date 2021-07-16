<template>
  <h2 class="h-title">Listening History</h2>
  <h3 class="h-subtitle my-4">
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
        <table class="mt-4 history-table">
          <thead>
            <tr class="row-head">
              <th class="cell-head cell-title">Title</th>
              <th class="cell-head cell-artist">Artist</th>
              <th class="cell-head cell-album">Album</th>
              <th class="cell-head cell-listened">Listened</th>
              <th class="cell-head cell-duration">Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="row"
              v-for="track in recentlyPlayed"
              :key="track.played_at"
            >
              <td class="cell cell-title">
                <router-link
                  class="link"
                  :to="{ name: 'track', params: { id: track.id } }"
                >
                  {{ track.name }}
                </router-link>
              </td>
              <td class="cell cell-artist">
                <multi-router :routes="track.artists" />
              </td>
              <td class="cell cell-album">
                <router-link
                  class="link"
                  :to="{ name: 'album', params: { id: track.album.id } }"
                >
                  {{ track.album.name }}
                </router-link>
              </td>
              <td class="cell cell-listened">
                {{ getDateFromNow(track.played_at) }}
              </td>
              <td class="cell cell-duration">
                {{ getDuration(track.duration_ms) }}
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="loadingNextPage" class="leading-8 skeleton w-full">
          &nbsp;
        </div>
      </infinite-scroll>
    </template>
  </template>
</template>

<script>
import { formatDistanceToNowStrict, addSeconds, format } from "date-fns";
import { getListeningHistory } from "@/api";
import EmptyMessage from "@/components/EmptyMessage";
import BaseInput from "@/components/BaseInput";
import InfiniteScroll from "@/components/InfiniteScroll";
import MultiRouter from "@/components/MultiRouter";

export default {
  name: "History",
  components: { EmptyMessage, BaseInput, InfiniteScroll, MultiRouter },
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
.history-table {
  @apply w-full border-collapse table-fixed;
}
.history-table .row-head {
  @apply z-20 sticky top-0 bg-gray-800-spotify;
}
.history-table .cell-head {
  @apply px-4 py-3 text-left text-sm font-semibold text-gray-500-spotify;
}
.history-table .row {
  @apply border-b border-gray-700-spotify hover:bg-gray-700-spotify;
}
.history-table .cell {
  @apply px-4 py-2 text-left text-sm overflow-ellipsis overflow-hidden whitespace-nowrap text-white;
}
.history-table .cell-title {
  @apply w-1.5/10 md:w-3/10;
}
.history-table .cell-artist {
  @apply hidden w-2.5/10 sm:table-cell;
}
.history-table .cell-album {
  @apply hidden w-2/10 md:table-cell;
}
.history-table .cell-listened {
  @apply w-1/10 md:w-1.5/10;
}
.history-table .cell-duration {
  @apply hidden w-1/10 lg:table-cell;
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
