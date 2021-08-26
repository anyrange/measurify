<template>
  <router-link
    :to="{ name: 'track', params: { id: track.id } }"
    class="
      flex flex-row
      w-full
      items-center
      gap-2
      transform
      active:scale-95
      transition-all
      duration-100
      hover:bg-gray-600-spotify hover:bg-opacity-20
    "
  >
    <base-img
      :src="track.image"
      :alt="track.name"
      class="flex-shrink-0 w-15 h-12 object-cover"
    />
    <div>
      <span class="text-white text-sm truncate">{{ track.name }}</span>
      <multi-router :routes="track.artists" disabled />
    </div>
  </router-link>
</template>

<script>
import BaseImg from "@/components/BaseImg";
import MultiRouter from "@/components/MultiRouter";

export default {
  name: "TracksItem",
  props: {
    track: {
      type: Object,
      required: true,
    },
  },
  components: {
    BaseImg,
    MultiRouter,
  },
};
</script>
