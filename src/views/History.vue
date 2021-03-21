<template>
  <div class="container mx-auto">
    <h2 class="mt-12 mx-4 text-5xl font-semibold text-white">
      Listening History
    </h2>
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
            class="bg-gray-700-spotify text-gray-300 placeholder-gray-400 rounded-md px-32 pl-8 py-2 outline-none"
          />
          <div class="absolute top-0">
            <svg
              class="fill-current text-gray-300 h-7 w-7 pt-2 pl-3"
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

    <div v-if="loading" class="mt-8">
      <div
        class="fixed w-100 h-100 opacity-80 inset-0 z-50 flex items-center justify-center"
      >
        <svg
          class="animate-spin -ml-1 mr-3 h-12 w-12 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    </div>

    <div class="mt-8" v-else>
      <table class="w-full table-fixed">
        <thead>
          <tr>
            <th class="history-th w-3/10">
              Title
            </th>
            <th class="history-th w-2.5/10">
              Artist
            </th>
            <th class="history-th w-2/10">
              Album
            </th>
            <th class="history-th w-1.5/10">
              When
            </th>
            <th class="history-th w-1/10">
              Duration
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredTable" :key="item.id" class="history-tr">
            <td class="history-td">
              {{ item.track.name }}
            </td>
            <td class="history-td">
              {{
                item.track.artists
                  .map(({ name }) => {
                    return name;
                  })
                  .join(", ")
              }}
            </td>
            <td class="history-td">
              {{ item.track.album.name }}
            </td>
            <td class="history-td">
              {{ getDateFromNow(item.played_at) }}
            </td>
            <td class="history-td">
              {{ getDuration(item.track.duration_ms) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style>
.history-td {
  @apply px-6 py-2 border-b border-gray-700-spotify text-sm leading-5 text-gray-100 overflow-ellipsis overflow-hidden whitespace-nowrap;
}
.history-th {
  @apply px-6 py-3 border-b-2 border-gray-700-spotify text-left leading-4;
}
.history-tr {
  @apply hover:bg-gray-700-spotify;
}
</style>

<script>
import axios from "axios";
import { formatDistanceToNowStrict, addSeconds, format } from "date-fns";

export default {
  data() {
    return {
      recentlyPlayed: [],
      search: "",
      loading: true,
    };
  },
  methods: {
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
    axios
      .get(
        `${process.env.VUE_APP_SERVER_URI}/getPlayedHistory?spotifyID=${this.user.id}`
      )
      .catch((err) => console.log(err))
      .then((response) => {
        this.recentlyPlayed = response.data;
      })
      .finally(() => (this.loading = false));
  },
};
</script>
