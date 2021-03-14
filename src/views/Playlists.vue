<template>
  <div class="grid grid-cols-3 gap-4">
    <div
      v-for="playlist in playlists"
      :key="playlist.id"
      class="box-border h-84 w-64 p-5 border-4"
    >
      <img
        :src="playlist.images[0].url"
        class=" border border-gray-100 shadow-sm"
      />
      {{ playlist.name }}
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    playlists() {
      return this.$store.getters.getPlaylists;
    },
  },
};
</script>
