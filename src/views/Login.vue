<template>
  <div
    class="min-h-screen flex justify-center items-center bg-cover bg-no-repeat"
    :style="{ backgroundImage: `url('/img/bg.svg')` }"
  >
    <div class="flex flex-col items-center justify-center w-3/4">
      <h1 class="text-7xl text-gray-100">
        Spotiworm
      </h1>
      <div
        class="text-center text-lg text-gray-300 mb-4 font-normal border bg-gray-900-spotify bg-opacity-90 border-gray-700-spotify rounded-full px-2"
      >
        <span class="font-semibold">
          {{ quantity }}
        </span>
        <span class="font-normal">
          people already joined
        </span>
      </div>
      <div class="flex flex-col items-center justify-center gap-3">
        <h1 class="text-2xl text-center text-white md:text-gray-400-spotify">
          Track your listening history and get stats
        </h1>
        <base-button
          class="md:w-1/2 w-full"
          :loading="loadingButton"
          rounded
          @click="login()"
        >
          Log in with Spotify
        </base-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getUsersQuantity, redirect } from "@/api";
import { mapActions } from "vuex";
import BaseButton from "@/components/BaseButton";

export default {
  components: { BaseButton },
  data() {
    return {
      loadingButton: false,
      quantity: "?",
    };
  },
  methods: {
    ...mapActions(["authorise"]),
    login() {
      this.loadingButton = true;
      redirect();
    },
  },
  async created() {
    const response = await getUsersQuantity();
    this.quantity = response.quantity;
  },
};
</script>
