<template>
  <div class="container mx-auto">
    <h2 class="h-title">
      Listening History
    </h2>
    <template v-if="!emptyData">
      <template v-if="loading">
        <div class="mt-8">
          <LoadingSpinner />
        </div>
      </template>
      <template v-else>
        <h3 class="mx-4 mt-4 text-lg font-semibold text-gray-500">
          Click the song's title, artist, or album name to get more info
        </h3>
        <div class="top-bar flex items-center justify-between pt-4">
          <div class="flex items-center">
            <div class="ml-4 mt-2 relative">
              <input
                type="text"
                placeholder="Search"
                v-model="search"
                class="dark:bg-gray-700-spotify bg-gray-200 text-gray-400 dark:text-gray-300 dark:placeholder-gray-400 placeholder-gray-500 rounded-md px-32 pl-8 py-2 outline-none"
              />
              <div class="absolute top-0">
                <svg
                  class="fill-current dark:text-gray-300 text-gray-400 h-7 w-7 pt-2 pl-3"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path
                    class="heroicon-ui"
                    d="M16.32 14.9l5.39 5.4a1 1 0 01-1.42 1.4l-5.38-5.38a8 8 0 111.41-1.41zM10 16a6 6 0 100-12 6 6 0 000 12z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-8">
          <table class="w-full table-fixed">
            <thead>
              <tr>
                <th class="history-th w-3/10">
                  Title
                </th>
                <th class="history-th w-2.5/10 sm:table-cell hidden">
                  Artist
                </th>
                <th class="history-th w-2/10 md:table-cell hidden">
                  Album
                </th>
                <th class="history-th w-1.5/10">
                  When
                </th>
                <th class="history-th w-1/10 lg:table-cell hidden">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in filteredTable"
                :key="item.id"
                class="history-tr"
              >
                <td class="history-td">
                  {{ item.track.name }}
                </td>
                <td class="history-td sm:table-cell hidden">
                  {{
                    item.track.artists
                      .map(({ name }) => {
                        return name;
                      })
                      .join(", ")
                  }}
                </td>
                <td class="history-td md:table-cell hidden">
                  {{ item.track.album.name }}
                </td>
                <td class="history-td">
                  {{ getDateFromNow(item.played_at) }}
                </td>
                <td class="history-td lg:table-cell hidden">
                  {{ getDuration(item.track.duration_ms) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </template>
    <template v-else>
      <div class="flex h-80 justify-center items-center">
        <div class="text-center">
          <h3 class="mx-4 mt-4 text-2xl font-semibold text-gray-200">
            No listening data
          </h3>
          <h3 class="mx-4 mt-1 text-base font-semibold text-gray-500">
            Start listening to music on Spotify and come back later!
          </h3>
        </div>
      </div>
    </template>
  </div>
</template>

<style>
.history-td {
  @apply px-6 py-2 border-b border-gray-300 dark:border-gray-700-spotify text-sm leading-5 text-gray-800 dark:text-gray-100 overflow-ellipsis overflow-hidden whitespace-nowrap;
}
.history-th {
  @apply px-6 py-3 border-b dark:border-gray-700-spotify font-normal text-sm capitalize text-left leading-4;
}
.history-tr {
  @apply dark:hover:bg-gray-700-spotify hover:bg-gray-200;
}
</style>

<script>
import LoadingSpinner from "@/components/LoadingSpinner";
import axios from "axios";
import { formatDistanceToNowStrict, addSeconds, format } from "date-fns";

export default {
  components: {
    LoadingSpinner,
  },

  data() {
    return {
      recentlyPlayed: [],
      search: "",
      loading: true,

      emptyData: false,
    };
  },

  methods: {
    getListeningHistory() {
      axios
        .get(
          `${process.env.VUE_APP_SERVER_URI}/listening-history?spotifyID=${this.user.id}`
        )
        .catch((err) => console.log(err))
        .then((response) => {
          this.recentlyPlayed = response.data;
          this.emptyData = this.recentlyPlayed.length > 1 ? false : true;
        })
        .finally(() => (this.loading = false));
    },
    getDateFromNow(date) {
      return formatDistanceToNowStrict(Date.parse(date), { addSuffix: true });
    },
    getDuration(time) {
      return format(addSeconds(new Date(0), time / 1000), "mm:ss");
    },
  },

  computed: {
    user() {
      return this.$store.getters.getUser;
    },

    filteredTable() {
      return this.recentlyPlayed.filter((item) => {
        const song = item.track.name.toLowerCase();
        const album = item.track.album.name.toLowerCase();
        const artists = item.track.artists
          .map(({ name }) => {
            return name;
          })
          .join(", ")
          .toLowerCase();
        const query = this.search.toLowerCase();
        return (
          album.includes(query) ||
          song.includes(query) ||
          artists.includes(query)
        );
      });
    },
  },

  created() {
    this.getListeningHistory();
  },
};
</script>
