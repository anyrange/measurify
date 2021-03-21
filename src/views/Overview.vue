<template>
  <div class="container mx-auto">
    <h2 class="mt-12 mx-4 text-5xl font-semibold text-white">
      Overview
    </h2>
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
      <tbody>
        <tr v-for="item in overviewData" :key="item.date" class="history-tr">
          <td class="history-td">
            {{ item.plays }}
          </td>
          <td class="history-td">
            {{ item.date }}
          </td>
          <td class="history-td">
            {{ item.duration }}
          </td>
        </tr>
      </tbody>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      overviewData: [],
      loading: true,
    };
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    isActive() {
      return this.$route.name === "overview";
    },
  },
  created() {
    axios
      .get(
        `${process.env.VUE_APP_SERVER_URI}/getOverview?spotifyID=${this.user.id}`
      )
      .catch((err) => console.log(err))
      .then((response) => {
        this.overviewData = response.data.plays;
        console.log(this.overviewData);
      })
      .finally(() => (this.loading = false));
  },
};
</script>
