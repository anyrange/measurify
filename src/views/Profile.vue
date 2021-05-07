<template>
  <loading-spinner v-if="loading" />
  <template v-else>
    <div class="flex items-center">
      <div class="">
        <img
          :src="profile?.avatar"
          class="rounded-full object-cover w-20 h-20 shadow-sm"
        />
      </div>
      <div class="ml-4">
        <h2 class="h-title">
          {{ profile.username }}
        </h2>
      </div>
    </div>
    <div class="flex flex-row mt-6">
      <div class="badge">
        <div class="badge-title">Plays</div>
        <div class="badge-text">
          {{ profile.overview.plays }}
        </div>
      </div>
      <div class="ml-5 badge">
        <div class="badge-title">Playtime</div>
        <div class="badge-text">
          {{ profile.overview.playtime }}
        </div>
      </div>
    </div>
  </template>
</template>

<script>
import api from "@/api";

export default {
  data() {
    return {
      loading: true,
      profile: {},
    };
  },
  created() {
    api
      .getProfile(this.$route.params.id)
      .then((response) => {
        this.profile = response;
        console.log(response);
        document.title = `${this.profile.username} - Spotiworm`;
      })
      .finally(() => {
        this.loading = false;
      })
      .catch((error) => {
        this.$notify.show({
          type: "danger",
          message: error.response.data.message,
        });
        this.$router.push({
          name: "home",
        });
      });
  },
};
</script>

<style scoped>
.badge {
  @apply bg-gray-700-spotify w-52 p-2 rounded-full flex items-center flex-row justify-between;
}
.badge-title {
  @apply text-xl text-gray-400-spotify ml-2;
}
.badge-text {
  @apply text-2xl font-semibold text-gray-100 leading-tight mr-2;
}
</style>
