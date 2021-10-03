<template>
  <loading-spinner v-if="loading" />
  <template v-else>
    <error-message v-if="error" />
    <div v-else class="w-full flex flex-col gap-4">
      <div class="w-full flex flex-row items-center gap-4">
        <base-img
          :src="profile.user.avatar"
          :alt="profile.user.username"
          image-type="profile"
          class="
            flex flex-none
            object-cover
            rounded-full
            w-20
            h-20
            sm:w-36 sm:h-36
            duration-300
          "
        />
        <div
          class="
            gap-2
            w-full
            flex flex-row flex-wrap
            sm:flex-col
            items-center
            sm:items-start
            justify-between
            sm:justify-start
          "
        >
          <div class="flex flex-col">
            <spotify-link
              :link="`https://open.spotify.com/user/${profile.user.spotifyID}`"
            >
              {{ profile.user.display_name }}
            </spotify-link>
            <h3 class="font-light">@{{ profile.user.username }}</h3>
          </div>
          <router-link
            v-if="user.username === profile.user.username"
            class="
              hover:bg-gray-800-spotify
              text-white
              flex
              items-center
              justify-center
              text-center
              duration-75
              border
              default-border
              rounded
              px-2
              py-1
            "
            :to="{ name: 'account' }"
          >
            Settings
          </router-link>
        </div>
      </div>
      <div class="fullwidth">
        <horizontal-scroll>
          <nav class="profile-nav">
            <router-link
              class="profile-nav-link"
              :to="{ name: 'profile-overview' }"
            >
              Overview
            </router-link>
            <router-link
              class="profile-nav-link"
              :to="{ name: 'profile-history' }"
            >
              History
            </router-link>
            <!--
          <router-link
            class="profile-nav-link"
            :to="{ name: 'profile-library' }"
          >
            Library
          </router-link>
          <router-link
            class="profile-nav-link"
            :to="{ name: 'profile-reports' }"
          >
            Reports
          </router-link>
          --></nav>
        </horizontal-scroll>
      </div>
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
  </template>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { formatDate } from "@/utils/formatters";
import HorizontalScroll from "@/components/HorizontalScroll.vue";
import SpotifyLink from "@/components/SpotifyLink.vue";
import BaseImg from "@/components/BaseImg.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";

export default {
  components: {
    HorizontalScroll,
    SpotifyLink,
    BaseImg,
    ErrorMessage,
  },
  data() {
    return {
      loading: true,
      error: false,
    };
  },
  computed: {
    ...mapState({
      profile: (state) => state.profile.profile,
      user: (state) => state.auth.user,
    }),
  },
  watch: {
    "$route.params.username": {
      handler: async function (newValue, oldValue) {
        if (!newValue || newValue === oldValue) {
          return;
        }
        try {
          this.loading = true;
          this.error = false;
          await this.getProfile(newValue);
          this.$meta.setTitle(
            `${this.profile.user.display_name} (@${this.profile.user.username})`
          );
        } catch (error) {
          this.error = true;
        } finally {
          this.loading = false;
        }
      },
      immediate: true,
    },
  },
  methods: {
    formatDate,
    ...mapActions({
      getProfile: "profile/getProfile",
    }),
  },
};
</script>

<style scoped lang="postcss">
.profile-nav {
  @apply flex flex-row gap-2;
}
.profile-nav .profile-nav-link {
  @apply py-2 px-3 flex flex-shrink-0 flex-none hover:text-green-500-spotify;
}
.profile-nav .router-link-exact-active {
  @apply text-green-500-spotify border-b-2 border-green-500-spotify;
}
</style>
