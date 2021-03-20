<template>
  <table class="min-w-full">
    <thead>
      <tr>
        <th class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4">
          Title
        </th>
        <th class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4">
          Artist
        </th>
        <th class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4">
          Album
        </th>
        <th class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4">
          When
        </th>
        <th class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4">
          Duration
        </th>
      </tr>
    </thead>
    <tbody class="bg-white">
      <tr v-for="item in recentlyPlayed" :key="item.id">
        <td
          class="px-6 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-200 text-sm leading-5"
        >
          {{ item.track.name }}
        </td>
        <td
          class="px-6 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-200 text-sm leading-5"
        >
          {{
            item.track.artists
              .map(({ name }) => {
                return name;
              })
              .join(", ")
          }}
        </td>
        <td
          class="px-6 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-200 text-sm leading-5"
        >
          {{ item.track.album.name }}
        </td>
        <td
          class="px-6 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-200 text-sm leading-5"
        >
          {{ getDateFromNow(item.played_at) }}
        </td>
        <td
          class="px-6 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-200 text-sm leading-5"
        >
          {{ getDuration(item.track.duration_ms) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import axios from "axios";
import { formatDistanceToNowStrict, addSeconds, format } from "date-fns";

export default {
  data() {
    return {
      recentlyPlayed: [],
    };
  },
  methods: {
    showArtists() {},
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
  },
  created() {
    axios
      .get(
        `${process.env.VUE_APP_SERVER_URI}/getPlayedHistory?spotifyID=${this.user.id}`
      )
      .catch((err) => console.log(err))
      .then((response) => {
        this.recentlyPlayed = response.data;
        console.log(this.recentlyPlayed);
      });
  },
};
</script>
