<template>
  <h2 class="h-title">Listening History</h2>
  <h3 class="h-subtitle mt-4 mb-4">
    Click the song's title, artist, or album name to get more info
  </h3>
  <custom-input
    v-model="searchQuery"
    class="sm:w-full md:w-2/3 lg:w-1/2"
    placeholder="Search"
    type="text"
    iconLeft
    :disabled="!searchQuery && emptyData"
  >
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path
        d="M16.32 14.9l5.39 5.4a1 1 0 01-1.42 1.4l-5.38-5.38a8 8 0 111.41-1.41zM10 16a6 6 0 100-12 6 6 0 000 12z"
      />
    </svg>
  </custom-input>
  <loading-spinner v-if="loading" />
  <template v-else>
    <empty-message v-if="emptyData" />
    <template v-else>
      <table class="mt-4 w-full table-fixed">
        <thead>
          <tr>
            <th class="history-th md:w-3/10 w-1.5/10">
              Title
            </th>
            <th class="history-th w-2.5/10 sm:table-cell hidden">
              Artist
            </th>
            <th class="history-th w-2/10 md:table-cell hidden">
              Album
            </th>
            <th class="history-th md:w-1.5/10 w-1/10">
              When
            </th>
            <th class="history-th w-1/10 lg:table-cell hidden">
              Duration
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(track, index) in recentlyPlayed"
            :key="index"
            class="history-tr"
          >
            <td class="history-td">
              <router-link
                class="hover:underline"
                :to="{ name: 'track', params: { id: track.id } }"
              >
                {{ track.name }}
              </router-link>
            </td>
            <td class="history-td sm:table-cell hidden">
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
            <td class="history-td md:table-cell hidden">
              {{ track.album.name }}
            </td>
            <td class="history-td">
              {{ getDateFromNow(track.played_at) }}
            </td>
            <td class="history-td lg:table-cell hidden">
              {{ getDuration(track.duration_ms) }}
            </td>
          </tr>
        </tbody>
      </table>
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
import CustomInput from "@/components/CustomInput";

export default {
  name: "History",
  components: { EmptyMessage, CustomInput },
  data() {
    return {
      recentlyPlayed: [],
      pagesMax: 1,
      page: 1,
      searchQuery: "",
      loading: true,
      loadingNextPage: false,
      emptyData: false,
      contentWindow: null,
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
    async handleScroll() {
      let bottomOfWindow =
        this.contentWindow.offsetHeight + this.contentWindow.scrollTop >=
        this.contentWindow.scrollHeight
          ? true
          : false;
      if (
        bottomOfWindow &&
        !this.loadingNextPage &&
        this.page < this.pagesMax
      ) {
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
        this.emptyData = false;
        const response = await getListeningHistory({
          page: this.page,
          query: this.searchQuery,
        });
        this.loading = false;
        this.emptyData = response.status === 204 ? true : false;
        this.pagesMax = response.pages;
        this.recentlyPlayed = response.history;
      },
      immediate: true,
    },
  },
  mounted() {
    this.contentWindow = document.querySelector(".content-spotify");
    this.contentWindow.addEventListener("scroll", this.handleScroll);
  },
  unmounted() {
    this.contentWindow.removeEventListener("scroll", this.handleScroll);
  },
};
</script>

<style lang="postcss" scoped>
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
