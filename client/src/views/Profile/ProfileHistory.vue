<template>
  <container>
    <container-item>
      <div class="flex gap-2">
        <base-input
          v-model.lazy="search"
          placeholder="Search"
          :debounce="400"
        />
        <base-select v-model="range" :options="$options.rangeOptions" />
      </div>
      <loading-spinner v-if="loading" />
      <template v-else>
        <empty-message
          v-if="!listeningHistory.history.length && search && !loading"
        />
        <track-rows>
          <track-row
            v-for="(item, index) in listeningHistory.history"
            :key="index"
            :track="item"
          />
        </track-rows>
        <div class="flex justify-center">
          <pagination v-model="page" :total-pages="listeningHistory.pages" />
        </div>
      </template>
    </container-item>
  </container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Container from "@/components/Container";
import ContainerItem from "@/components/ContainerItem";
import Pagination from "@/components/Pagination";
import TrackRows from "@/components/TrackRows";
import TrackRow from "@/components/TrackRow";
import BaseInput from "@/components/BaseInput";
import BaseSelect from "@/components/BaseSelect";
import EmptyMessage from "@/components/EmptyMessage";

export default {
  components: {
    Container,
    ContainerItem,
    Pagination,
    TrackRows,
    TrackRow,
    BaseInput,
    BaseSelect,
    EmptyMessage,
  },
  data() {
    return {
      timePeriod: "am",
      loading: true,
      page: 1,
      range: 50,
      search: "",
    };
  },
  rangeOptions: [
    { label: "10", value: 10 },
    { label: "25", value: 25 },
    { label: "50", value: 50 },
  ],
  computed: {
    ...mapState({
      listeningHistory: (state) => state.profile.listeningHistory,
    }),
    pageStateOptions() {
      return {
        search: this.search,
        page: this.page,
        range: this.range,
      };
    },
  },
  watch: {
    $route: {
      handler({ query: { page, search, range } }) {
        this.page = parseInt(page) || this.page;
        this.range = parseInt(range) || this.range;
        this.search = search || this.search;
      },
      immediate: true,
    },
    search() {
      this.page = 1;
    },
    async pageStateOptions(query) {
      this.$router.push({ path: this.$route.path, query });
      await this.getListeningHistory(query);
    },
  },
  methods: {
    ...mapActions({
      getHistory: "profile/getHistory",
    }),
    async getListeningHistory(params) {
      try {
        this.loading = true;
        await this.getHistory(params);
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
  },
  async mounted() {
    await this.getListeningHistory(this.pageStateOptions);
  },
};
</script>

