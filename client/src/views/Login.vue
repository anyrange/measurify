<template>
  <div
    class="min-h-screen flex justify-center items-center bg-cover bg-no-repeat"
    :style="{ backgroundImage: `url('${backgroundImage}')` }"
  >
    <div class="flex flex-col gap-2 items-center justify-center">
      <h1 class="sm:text-7xl text-6xl text-gray-100">Spotiworm</h1>
      <h2 class="sm:text-2xl text-center text-gray-400-spotify mb-2">
        Track your listening history and get stats
      </h2>
      <base-button :loading="loading" rounded @click="login()">
        Log in with Spotify
      </base-button>
    </div>
  </div>
</template>

<script setup>
import { useFetch } from "@/composable/useFetch";
import { redirect } from "@/api";
import backgroundImage from "@/assets/media/bg.svg";

const { fetchData, loading } = useFetch();

const login = () => fetchData(() => redirect());
</script>
