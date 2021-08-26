<template>
  <div class="flex flex-col gap-3">
    <h1 class="h-title">Listening History</h1>
    <h2 class="h-subtitle">
      Click on a song title, artist, or album title for more information
    </h2>
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
  </div>
  <loading-spinner v-if="loading" />
  <template v-else>
    <empty-message v-if="emptyData" />
    <div v-else class="-mx-4 sm:mx-0">
      <div class="track-row-head">
        <div class="track-row__title">Title</div>
        <div class="track-row__artists">Artist</div>
        <div class="track-row__album">Album</div>
        <div class="track-row__listened">Listened</div>
        <div class="track-row__duration">Duration</div>
      </div>
      <div
        class="overflow-y-auto fullwidth"
        :style="viewportStyle"
        ref="viewport"
      >
        <div
          class="flex flex-col divide-y divide-gray-600-spotify"
          :style="spacerStyle"
          ref="spacer"
        >
          <!-- <div
            v-if="showCurrentTrack"
            class="track-row hover:bg-gray-700-spotify"
          >
            <div class="track-row__title">
              track
            </div>
            <div class="track-row__artists">
              artists
            </div>
            <div class="track-row__album">
              album
            </div>
            <div class="track-row__listened">
              track.played_at
            </div>
            <div class="track-row__duration">
              track.duration_ms
            </div>
          </div> -->
          <div
            class="track-row hover:bg-gray-700-spotify"
            v-for="track in visibleItems"
            :key="track"
          >
            <div class="track-row__title">
              <router-link
                class="link"
                :to="{ name: 'track', params: { id: track.id } }"
              >
                {{ track.name }}
              </router-link>
            </div>
            <div class="track-row__artists">
              <multi-router :routes="track.artists" />
            </div>
            <div class="track-row__album">
              <router-link
                class="link"
                :to="{ name: 'album', params: { id: track.album.id } }"
              >
                {{ track.album.name }}
              </router-link>
            </div>
            <div class="track-row__listened">
              {{ getDateFromNow(track.played_at) }}
            </div>
            <div class="track-row__duration">
              {{ getDuration(track.duration_ms) }}
            </div>
          </div>
        </div>
      </div>
      <div v-show="loadingNextPage" class="leading-8 skeleton w-full">
        &nbsp;
      </div>
    </div>
  </template>
</template>

<script>
import { getDateFromNow, getDuration } from "@/utils/formatters";
// eslint-disable-next-line no-unused-vars
import { getListeningHistory, getCurrentPlayingTrack } from "@/api";
import EmptyMessage from "@/components/EmptyMessage";
import BaseInput from "@/components/BaseInput";
import MultiRouter from "@/components/MultiRouter";

export default {
  name: "History",
  components: { EmptyMessage, BaseInput, MultiRouter },
  data() {
    return {
      contentWindow: null,

      page: 1,
      pages: 27,

      searchQuery: "",
      lastSuccessQuery: "",

      emptyData: false,

      loading: true,
      loadingNextPage: false,

      recentlyPlayed: [],
      // currentTrack: false,

      offset: 350,
      rootHeight: 400,
      rowHeight: 30,
      scrollTop: 0,
      nodePadding: 10,
    };
  },
  watch: {
    async searchQuery() {
      !(
        this.emptyData && this.lastSuccessQuery.length < this.searchQuery.length
      ) & ((this.page = 1), await this.loadListeningHistory());
    },
  },
  computed: {
    // showCurrentTrack() {
    //   return !this.searchQuery.length && this.page === 1;
    // },
    viewportHeight() {
      return this.itemCount * this.rowHeight;
    },
    startIndex() {
      let startNode =
        Math.floor(this.scrollTop / this.rowHeight) - this.nodePadding;
      startNode = Math.max(0, startNode);
      return startNode;
    },
    visibleNodeCount() {
      let count =
        Math.ceil(this.rootHeight / this.rowHeight) + 2 * this.nodePadding;
      count = Math.min(this.itemCount - this.startIndex, count);
      return count;
    },
    visibleItems() {
      return this.recentlyPlayed.slice(
        this.startIndex,
        this.startIndex + this.visibleNodeCount
      );
    },
    itemCount() {
      return this.recentlyPlayed.length;
    },
    offsetY() {
      const offset = this.startIndex * this.rowHeight;
      return offset;
    },
    spacerStyle() {
      return {
        transform: "translateY(" + this.offsetY + "px)",
      };
    },
    viewportStyle() {
      return {
        overflow: "hidden",
        height: this.viewportHeight + "px",
        position: "relative",
      };
    },
  },
  async mounted() {
    await this.loadListeningHistory();
    this.contentWindow = document.querySelector(".content-window");
    this.contentWindow.addEventListener("scroll", this.handleScroll);
    const largestHeight = this.calculateInitialRowHeight();
    this.rowHeight =
      typeof largestHeight !== "undefined" && largestHeight !== null
        ? largestHeight
        : 30;
  },
  beforeUnmount() {
    this.contentWindow.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    getDateFromNow,
    getDuration,
    async loadListeningHistory() {
      this.loading = true;
      const response = await getListeningHistory({
        page: this.page,
        query: this.searchQuery,
      });
      this.emptyData = response.status === 204;
      this.lastSuccessQuery = this.searchQuery;
      this.pages = response.pages;
      this.recentlyPlayed = response.history;
      this.loading = false;
    },
    async loadMore() {
      if (this.page < this.pages) {
        this.loadingNextPage = true;
        this.page++;
        const response = await getListeningHistory({
          page: this.page,
          query: this.searchQuery,
        });
        this.recentlyPlayed.push(...response.history);
        this.loadingNextPage = false;
      }
    },
    async handleScroll() {
      const bottomOfWindow =
        this.contentWindow.offsetHeight + this.contentWindow.scrollTop >=
        this.contentWindow.scrollHeight - this.offset;
      if (bottomOfWindow && !this.loadingNextPage) {
        await this.loadMore();
      }
      this.scrollTop = this.contentWindow.scrollTop;
    },
    calculateInitialRowHeight() {
      const children = this.$refs.spacer.children;
      let largestHeight = 0;
      for (let i = 0; i < children.length; i++) {
        if (children[i].offsetHeight > largestHeight) {
          largestHeight = children[i].offsetHeight;
        }
      }
      return largestHeight;
    },
  },
};
</script>

<style lang="postcss" scoped>
.track-row {
  @apply truncate flex flex-row gap-3 items-center w-full h-9 px-4;
}
.track-row-head {
  @apply track-row;
  @apply sticky z-20 -top-4 font-semibold bg-gray-800-spotify;
}
.track-row__title {
  @apply truncate lg:w-2.5/10 md:w-3/10 w-7/10;
}
.track-row__artists {
  @apply truncate md:w-2.5/10 w-4.5/10 sm:flex hidden;
}
.track-row__album {
  @apply truncate w-2/10 md:flex hidden;
}
.track-row__listened {
  @apply truncate md:w-1/10 lg:w-2/10 w-3/10 ml-auto text-right sm:text-left;
}
.track-row__duration {
  @apply truncate w-1/10 hidden lg:flex ml-auto;
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
