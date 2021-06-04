<template>
  <h2 class="h-title">Listening History</h2>
  <loading-spinner v-if="loading" />
  <template v-else>
    <template v-if="emptyData">
      <empty-message />
    </template>
    <template v-else>
      <h3 class="h-subtitle mt-4">
        Click the song's title, artist, or album name to get more info
      </h3>
      <div class="flex items-center justify-between pt-4">
        <div class="flex items-center">
          <div class="mt-2 relative">
            <input
              type="text"
              placeholder="Search"
              v-model="searchQuery"
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
      <div class="mt-4">
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
              v-for="(item, index) in recentlyPlayed"
              :key="index"
              class="history-tr"
            >
              <td class="history-td">
                <router-link
                  class="hover:underline"
                  :to="{
                    name: 'track',
                    params: {
                      id: item.id,
                      title: item.name,
                    },
                  }"
                >
                  {{ item.name }}
                </router-link>
              </td>
              <td class="history-td sm:table-cell hidden">
                {{
                  item.artists
                    .map(({ name }) => {
                      return name;
                    })
                    .join(", ")
                }}
              </td>
              <td class="history-td md:table-cell hidden">
                {{ item.album.name }}
              </td>
              <td class="history-td">
                {{ getDateFromNow(item.played_at) }}
              </td>
              <td class="history-td lg:table-cell hidden">
                {{ getDuration(item.duration_ms) }}
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
</template>

<script>
import { formatDistanceToNowStrict, addSeconds, format } from "date-fns";
import { getListeningHistory } from "@/api";
import EmptyMessage from "@/components/EmptyMessage";

export default {
  components: {
    EmptyMessage,
  },
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
        const response = await getListeningHistory({
          page: this.page,
          query: this.searchQuery,
        });
        this.recentlyPlayed = response.history;
        this.pagesMax = response.pages;
      },
      immediate: false,
    },
  },
  async created() {
    const response = await getListeningHistory({
      page: this.page,
      query: this.searchQuery,
    });
    if (response.status === 204) {
      return (this.emptyData = true);
    }
    this.pagesMax = response.pages;
    this.recentlyPlayed = response.history;
    this.loading = false;
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
.search-field {
  @apply bg-gray-700-spotify text-gray-300 placeholder-gray-400 rounded-md sm:px-32 sm:pl-8 pl-8 py-2 outline-none;
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
