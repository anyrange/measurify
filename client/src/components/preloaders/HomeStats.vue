<template>
  <container>
    <cards>
      <card :title="stats.users.active">users</card>
      <card :title="stats.tracks">tracks</card>
      <card :title="stats.albums">albums</card>
      <card :title="stats.artists">artists</card>
    </cards>
  </container>
</template>

<script setup>
import { ref } from "vue";
import { getStats } from "@/api";

const stats = ref(null);

stats.value = await getStats();
</script>
