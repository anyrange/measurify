<template>
  <div class="container mx-auto">
    <template v-if="loading">
      <div class="mt-8">
        <LoadingSpinner />
      </div>
    </template>
    <template v-else>
      <h2 class="h-title">
        {{ track.track.name }}
      </h2>
      <img :src="track.track.image" class="w-56 h-56 mx-4 my-6 object-cover" />
    </template>
  </div>
</template>

<script>
import axios from "axios";
import LoadingSpinner from "@/components/LoadingSpinner";

export default {
  components: {
    LoadingSpinner,
  },
  data() {
    return {
      loading: true,
      overview: [],
      track: {},
    };
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
  },
  created() {
    axios
      .get(`${process.env.VUE_APP_SERVER_URI}/track/${this.$route.params.id}`, {
        headers: {
          Authorization: this.user._id,
        },
      })
      .catch((err) => console.log(err))
      .then((response) => {
        console.log(response.data);
        this.track = response.data;
        console.log(this.track);
        console.log(this.track.track.name);
      })
      .finally(() => (this.loading = false));
  },
};
</script>

<style lang="postcss" scoped></style>
