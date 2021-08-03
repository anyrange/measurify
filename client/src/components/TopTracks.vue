<template>
  <div class="flex flex-col gap-3">
    <div
      v-for="(track, index) in tracks"
      :key="index"
      class="flex flex-row items-center gap-4"
    >
      <span class="text-white font-semibold text-base flex-none w-6">
        {{ index + 1 }}
      </span>
      <router-link
        :to="{ name: 'track', params: { id: track.id } }"
        class="
          flex flex-row
          items-center
          justify-between
          pr-3
          hover:bg-gray-700-spotify
          duration-100
          rounded
          w-full
        "
      >
        <div class="flex items-center gap-3">
          <base-img
            :src="track.image"
            :alt="track.name"
            class="w-14 h-14 object-cover rounded"
          />
          <div class="flex flex-col">
            <div class="text-white text-base">
              {{ track.name }}
            </div>
            <div class="text-gray-400-spotify text-sm font-normal">
              {{ getDateFromNow(track.lastPlayedAt) }}
            </div>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import BaseImg from "@/components/BaseImg.vue";
import { getDateFromNow } from "@/utils/formatters";

export default {
  name: "TopTracks",
  props: {
    tracks: {
      type: Array,
      required: true,
    },
  },
  components: {
    BaseImg,
  },
  methods: {
    getDateFromNow,
  },
};
</script>
