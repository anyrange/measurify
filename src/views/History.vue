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
        <h3 class="h-subtitle">
          Click the song's title, artist, or album name to get more info
        </h3>
        <div class="top-bar flex items-center justify-between pt-4">
          <div class="flex items-center">
            <div class="ml-4 mt-2 relative">
              <input
                type="text"
                placeholder="Search"
                v-model="search"
                class="search-field"
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
                v-for="item in filteredTable"
                :key="item.id"
                class="history-tr"
              >
                <td class="history-td">
                  <router-link
                    class="hover:underline"
                    :to="{
                      name: 'track',
                      params: {
                        id: item.track.id,
                        title: item.track.name,
                      },
                    }"
                  >
                    {{ item.track.name }}
                  </router-link>
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
          <template v-if="loadingNextPage">
            <div class="leading-8 skeleton w-full">
              &nbsp;
            </div>
          </template>
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

<script>
import { formatDistanceToNowStrict, addSeconds, format } from "date-fns";
import api from "@/api";

export default {
  data() {
    return {
      recentlyPlayed: [],
      search: "",

      pagesMax: 1,
      page: 1,

      loading: true,
      loadingNextPage: false,

      emptyData: false,
    };
  },
  computed: {
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
  methods: {
    getDateFromNow(date) {
      return formatDistanceToNowStrict(Date.parse(date), {
        addSuffix: true,
      });
    },
    getDuration(time) {
      return format(addSeconds(new Date(0), time / 1000), "mm:ss");
    },
    getInitialHistory() {
      api
        .getListeningHistory(this.page)
        .then((response) => {
          this.pagesMax = response.numberOfPages;
          this.recentlyPlayed = response.history;
        })
        .finally(() => {
          this.loading = false;
          this.page++;
        });
    },
    getNextHistoryPage() {
      const windowScroll = document.querySelector(".content-spotify");
      windowScroll.onscroll = () => {
        let bottomOfWindow =
          windowScroll.offsetHeight + windowScroll.scrollTop >=
          windowScroll.scrollHeight
            ? true
            : false;
        if (
          bottomOfWindow &&
          this.page <= this.pagesMax &&
          !this.loadingNextPage
        ) {
          this.loadingNextPage = true;
          api
            .getListeningHistory(this.page)
            .then((response) => {
              this.recentlyPlayed.push(...response.history);
            })
            .finally(() => {
              this.loadingNextPage = false;
              this.page++;
            });
        }
      };
    },
  },
  created() {
    this.getInitialHistory();
  },
  mounted() {
    this.getNextHistoryPage();
  },
};
</script>

<style lang="postcss" scoped>
.search-field {
  @apply dark:bg-gray-700-spotify bg-gray-200 text-gray-400 dark:text-gray-300 dark:placeholder-gray-400 placeholder-gray-500 rounded-md sm:px-32 sm:pl-8 pl-8 py-2 outline-none;
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
