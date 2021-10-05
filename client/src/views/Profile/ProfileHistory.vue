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
            plays-or-date="date"
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
import Container from "@/components/Container.vue";
import ContainerItem from "@/components/ContainerItem.vue";
import Pagination from "@/components/Pagination.vue";
import TrackRows from "@/components/TrackRows.vue";
import TrackRow from "@/components/TrackRow.vue";
import BaseInput from "@/components/BaseInput.vue";
import BaseSelect from "@/components/BaseSelect.vue";
import EmptyMessage from "@/components/EmptyMessage.vue";

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
      profile: (state) => state.profile.profile,
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
    range() {
      this.page = 1;
    },
    async pageStateOptions(query) {
      this.$router.push({ path: this.$route.path, query });
      await this.getListeningHistory(query);
    },
  },
  async mounted() {
    await this.getListeningHistory(this.pageStateOptions);
  },
  activated() {
    this.$meta.setTitle(
      `${this.profile.user.display_name}'s listening history`
    );
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
};
</script>
