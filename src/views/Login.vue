<template>
  <div class="login-landing">
    <div class="login-container">
      <h1 class="app-title">
        Spotiworm
      </h1>
      <p class="text-center users">
        <span class="font-semibold">{{ quantity }}</span>
        people already joined
      </p>
      <h1 class="app-description">
        Track your listening history and get stats
      </h1>
      <button @click="login" class="login-button">
        Log in with Spotify
      </button>
    </div>
  </div>
</template>

<script>
import { getUsersQuantity } from "@/api";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      quantity: "?",
    };
  },
  methods: {
    ...mapActions(["login", "authorise"]),
  },
  async created() {
    const response = await getUsersQuantity();
    this.quantity = response.quantity;

    if (this.$route.query.access_token) {
      try {
        await this.authorise({
          access_token: this.$route.query.access_token,
          id: this.$route.query.id,
        });
        this.$router.push({ name: "home" });
      } catch (error) {
        this.$notify.show({
          type: "danger",
          message: error.response.data.error.message,
        });
      }
    }
  },
};
</script>

<style lang="postcss">
.login-landing {
  @apply min-h-screen flex justify-center items-center;
  background-image: url("data:image/svg+xml,%3Csvg width='1920' height='960' viewBox='0 0 1920 960' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0)'%3E%3Cpath d='M1920 0H0V960H1920V0Z' fill='%23121212'/%3E%3Cpath d='M1847.48 325.246C1676.26 524.196 1698.74 824.275 1897.69 995.493C2096.64 1166.71 2396.72 1144.23 2567.94 945.281C2739.16 746.332 2716.68 446.252 2517.73 275.035C2318.78 103.817 2018.7 126.297 1847.48 325.246Z' fill='url(%23paint0_linear)'/%3E%3Cpath d='M2162.5 912.294C2093.34 749.012 1904.91 672.711 1741.63 741.871C1578.35 811.032 1502.04 999.463 1571.2 1162.75C1640.37 1326.03 1828.8 1402.33 1992.08 1333.17C2155.36 1264.01 2231.66 1075.58 2162.5 912.294Z' fill='url(%23paint1_linear)'/%3E%3Cpath d='M-222.731 -346.044C-482.637 -309.373 -663.605 -68.9481 -626.933 190.959C-590.261 450.865 -349.837 631.833 -89.9304 595.161C169.976 558.489 350.944 318.065 314.272 58.1583C277.6 -201.748 37.1759 -382.716 -222.731 -346.044Z' fill='url(%23paint2_linear)'/%3E%3Cpath d='M83.7422 192.373C261.067 192.373 404.817 48.6223 404.817 -128.703C404.817 -306.028 261.067 -449.778 83.7422 -449.778C-93.5828 -449.778 -237.333 -306.028 -237.333 -128.703C-237.333 48.6223 -93.5828 192.373 83.7422 192.373Z' fill='url(%23paint3_linear)'/%3E%3C/g%3E%3Cdefs%3E%3ClinearGradient id='paint0_linear' x1='1847.48' y1='325.246' x2='2567.92' y2='945.265' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%231DB954'/%3E%3Cstop offset='1' stop-color='%231B8B42'/%3E%3C/linearGradient%3E%3ClinearGradient id='paint1_linear' x1='1992.07' y1='1333.17' x2='1741.61' y2='741.864' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%231DB954'/%3E%3Cstop offset='1' stop-color='%231B8B42'/%3E%3C/linearGradient%3E%3ClinearGradient id='paint2_linear' x1='-222.717' y1='-346.034' x2='-89.9201' y2='595.147' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%2300B83E'/%3E%3Cstop offset='0.0001' stop-color='%231DB954'/%3E%3Cstop offset='1' stop-color='%231B8B42'/%3E%3C/linearGradient%3E%3ClinearGradient id='paint3_linear' x1='83.7302' y1='192.367' x2='83.7302' y2='-449.796' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%231DB954'/%3E%3Cstop offset='1' stop-color='%231B8B42'/%3E%3C/linearGradient%3E%3CclipPath id='clip0'%3E%3Crect width='1920' height='960' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A");
  background-size: cover;
  background-repeat: no-repeat;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
}
.login-container {
  @apply flex flex-col items-center justify-center w-3/4;
}
.app-title {
  @apply text-7xl text-gray-100;
}
.users {
  @apply text-lg text-gray-300 mb-4 font-normal border border-gray-700-spotify rounded-full px-2;
}
.loading {
  @apply bg-gray-600-spotify border-gray-800-spotify;
}
.app-description {
  @apply text-2xl mb-2 mt-2 text-gray-300;
}
.login-button {
  @apply py-2 px-6 mt-4 bg-green-600-spotify text-lg rounded-full hover:bg-green-500-spotify transition-colors duration-150 text-white font-semibold focus:outline-none;
}
</style>
