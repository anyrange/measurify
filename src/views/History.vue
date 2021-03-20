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
      <tr v-for="track in recentlyPlayed" :key="track.id">
        <td
          class="px-6 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-200 text-sm leading-5"
        >
          {{ track.name }}
        </td>
        <td
          class="px-6 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-200 text-sm leading-5"
        >
          {{ track.artists[0].name }}
        </td>
        <td
          class="px-6 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-200 text-sm leading-5"
        >
          {{ track.album.name }}
        </td>
        <td
          class="px-6 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-200 text-sm leading-5"
        >
          {{ getDateFromNow(track.played_at) }}
        </td>
        <td
          class="px-6 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-200 text-sm leading-5"
        >
          {{ getTime(track.duration) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import axios from "axios";
import moment from "moment"; // fuck this shit, should be changed soon (gzipped 72.3K)

export default {
  data() {
    return {
      recentlyPlayed: [],
    };
  },
  methods: {
    getDateFromNow(date) {
      return moment(date).fromNow();
    },
    getTime(time) {
      return moment
        .utc(moment.duration(time, "seconds").asMilliseconds())
        .format("mm:ss");
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
        this.recentlyPlayed = response.data.tracks;
        console.log(this.recentlyPlayed);
      });
  },
};
</script>
