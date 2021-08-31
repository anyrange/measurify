<template>
  <div>
    <div
      class="
        h-12
        px-4
        md:flex
        flex-row
        hidden
        w-full
        items-center
        border-b
        default-border
        text-white
        select-none
      "
      :class="{
        'duration-75 hover:bg-gray-700-spotify cursor-pointer': showBackButton,
      }"
      @click="goBack()"
    >
      <button v-if="showBackButton" class="flex gap-3 items-center">
        <svg
          class="w-6 h-6"
          focusable="false"
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill="currentColor"
        >
          <path
            d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42a.9959.9959 0 00-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z"
          ></path>
        </svg>
        <span class="text-lg font-medium">Back</span>
      </button>
      <span v-else class="text-lg font-light flex items-center">
        <svg
          class="w-10 h-10 text-gray-700-spotify"
          viewBox="0 0 84 59"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M59.5583 6.17409C57.3787 6.48693 52.864 7.58184 50.6845 8.52034C48.3493 9.45883 45.3914 11.023 42.1221 13.0564C36.0506 17.1232 33.871 19.0002 31.2245 22.5978C27.9552 27.1338 25.7757 31.357 24.6859 35.5803C24.0632 38.2393 24.0632 43.4011 24.5302 45.5909C26.2427 51.6911 32.3142 57.0093 39.1642 58.5734C44.3016 59.6683 52.2413 58.5734 56.289 56.2272C60.648 53.5681 63.4502 49.3449 64.6957 43.0882C65.3184 39.9599 65.3184 38.7086 64.8514 35.8931C63.9173 30.2621 61.115 24.6312 57.5344 21.0336C57.5344 21.0336 57.2136 20.7484 56.6039 20.5321C55.5703 20.1656 53.6424 20.8772 53.6424 20.8772C50.8402 21.8157 47.7266 23.2234 47.8822 23.5363C47.8822 23.6927 48.6606 24.4748 49.5947 25.4132C52.864 28.8544 53.9538 30.575 54.8879 33.7033C56.1333 37.9265 55.5106 41.6805 52.864 44.6524C50.5288 47.4679 47.5709 48.8756 43.3675 48.8756C40.2539 48.8756 38.8528 48.4064 36.9846 46.373C34.8051 44.1831 34.1824 41.8369 34.6494 38.2393C35.1165 34.329 36.3619 31.9827 39.7869 28.3851C42.7448 25.2568 46.1698 22.9106 50.8402 20.8772C55.6662 18.8438 59.0912 18.0617 64.3843 18.0617C68.2763 18.0617 71.0786 18.3745 75.2819 19.4694C81.5091 21.19 84 20.2515 84 16.4975C84 15.4026 83.8443 14.9334 83.2216 13.9949C81.0421 10.5537 76.5274 8.2075 69.8331 6.79976C67.0309 6.01768 62.0491 5.86126 59.5583 6.17409Z"
            fill="currentColor"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M13.153 1.26589C12.8717 -0.386844 12.2828 -0.456722 11.9298 1.2659C11.8843 1.4879 11.809 2.25356 11.6106 2.8542C10.9335 4.9045 9.80474 5.94681 7.89186 6.99938C7.89186 6.99938 7.36499 7.26163 6.62151 7.39185C5.62156 7.56698 5.08753 7.29672 4.08148 6.83794C3.07544 6.37915 0.567944 5.35363 0.0903208 5.82611C-0.217889 6.131 0.232917 6.86487 1.9043 7.66487C2.83838 8.13412 3.53718 8.57495 3.80933 8.75697C3.80933 8.75697 4.45478 9.165 4.53505 9.48503C4.65034 9.94469 4.29368 10.675 4.29368 10.675C3.80933 11.7602 3.78212 12.8808 3.80933 13.3074C3.83654 13.734 3.99076 15.5082 6.00616 16.6188C8.25439 17.8578 9.5868 17.5573 14.4129 16.306C22.5082 14.2726 27.49 13.9597 33.7172 15.3675L36.1929 15.8907C40.2331 12.9333 42.1677 11.6999 46.0159 9.58009C46.1716 9.4547 46.2146 9.34678 46.1716 9.26726C45.718 8.42809 45.0998 8.22258 42.7263 7.07792C34.9423 3.32394 25.6015 1.44695 17.9732 3.9496C15.7936 4.57526 13.4902 4.98329 13.4252 4.10776C13.3719 3.38973 13.2486 1.82727 13.153 1.26589ZM11.6106 11.7699C12.0644 11.2142 11.9887 10.0104 11.455 9.42367C10.5476 8.42625 9.43112 9.73651 10.0538 11.4571C10.3652 12.0827 11.1568 12.3256 11.6106 11.7699ZM7.09592 12.2392C7.66731 11.9738 7.80081 10.4861 7.40728 9.89292C7.01375 9.29973 6.01013 9.5303 5.6948 10.675C5.38344 11.7699 6.31752 12.7084 7.09592 12.2392Z"
            fill="currentColor"
          />
        </svg>
      </span>
    </div>
    <aside class="mt-4 sidebar">
      <router-link
        v-if="isAuthenticated"
        v-wave
        class="sidebar__item"
        :to="{ name: 'profile', params: { username: user.username } }"
      >
        <account-icon class="sidebar__item__icon" />
        <span class="sidebar__item__title">Profile</span>
      </router-link>
      <router-link v-wave class="sidebar__item" :to="{ name: 'leaderboard' }">
        <leaderboard-icon class="sidebar__item__icon" />
        <span class="sidebar__item__title">Leaderboard</span>
      </router-link>
      <router-link v-wave class="sidebar__item" :to="{ name: 'friends' }">
        <friends-icon class="sidebar__item__icon" />
        <span class="sidebar__item__title">Friends</span>
      </router-link>
    </aside>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { AccountIcon, LeaderboardIcon, FriendsIcon } from "@/components/icons";

export default {
  components: {
    AccountIcon,
    LeaderboardIcon,
    FriendsIcon,
  },
  computed: {
    ...mapState({
      user: (state) => state.auth.user,
      historyLength: (state) => state.app.historyLength,
    }),
    ...mapGetters({
      isAuthenticated: "auth/isAuthenticated",
    }),
    showBackButton() {
      return !(
        this.$route.name === "profile-overview" &&
        this.$route.params.username === this.user.username
      );
    },
  },
  methods: {
    goBack() {
      if (!this.showBackButton) return;
      window.history.length - this.historyLength !== 0
        ? this.$router.go(-1)
        : this.$router.push({ name: "home" });
    },
  },
};
</script>

<style lang="postcss">
.sidebar {
  @apply flex sm:flex-col flex-row gap-2 flex-none z-50 sm:h-screen h-12 sm:px-4 p-0 sm:w-20 md:w-56 xl:w-72 w-full sm:relative fixed bottom-0 sm:inset-0 bg-gray-800-spotify;
}
.sidebar__item {
  @apply flex sm:flex-row flex-col flex-grow sm:flex-grow-0 gap-4 p-2 items-center md:justify-start sm:justify-center justify-center w-full cursor-pointer sm:rounded-md rounded-none sm:hover:text-white duration-75;
}
.sidebar__item__title {
  @apply md:flex hidden font-medium text-sm select-none;
}
.sidebar__item__username {
  @apply text-white text-base font-medium;
}
.sidebar__item__icon {
  @apply h-7 w-7 sm:w-8 sm:h-8 fill-current;
}
.sidebar__item__avatar {
  @apply h-7 w-7 sm:w-10 sm:h-10 rounded-full object-cover;
}
.sidebar .router-link-active {
  @apply text-green-500-spotify sm:text-white bg-gray-800-spotify sm:bg-gray-700-spotify;
}
</style>
