<template>
  <loading-spinner v-if="loading" />
  <template v-else>
    <div class="flex items-center">
      <div class="">
        <img
          :src="profile?.avatar"
          class="rounded-full object-cover md:w-20 md:h-20 h-16 w-16 shadow-sm"
        />
      </div>
      <div class="ml-4">
        <h2 class="text-4xl font-semibold dark:text-white text-gray-900">
          {{ profile.username }}
        </h2>
      </div>
    </div>
    <div class="flex md:flex-row flex-col mt-6">
      <div class="badge">
        <div class="badge-title">Plays</div>
        <div class="badge-text">
          {{ profile.overview.plays }}
        </div>
      </div>
      <div class="md:ml-5 mt-5 md:mt-0 badge">
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
