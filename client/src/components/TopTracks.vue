<template>
  <div class="w-full table table-fixed">
    <div class="flex flex-col gap-3">
      <div
        v-for="(track, index) in tracks"
        :key="track.id"
        class="flex flex-row items-center gap-4"
      >
        <span class="text-white font-semibold text-base flex-none w-6">
          {{ index + 1 }}
        </span>
        <div
          class="
            flex flex-row
            items-center
            justify-between
            pr-3
            duration-100
            rounded
            w-full
          "
        >
          <div class="flex items-center gap-3">
            <router-link
              class="flex-shrink-0"
              :to="{ name: 'track', params: { id: track.id } }"
            >
              <base-img
                :src="track.image"
                :alt="track.name"
                class="w-16 h-16 object-cover rounded-lg"
              />
            </router-link>
            <div class="flex flex-col">
              <router-link
                class="link text-base"
                :to="{ name: 'track', params: { id: track.id } }"
              >
                {{ track.name }}
              </router-link>
              <div class="text-gray-500-spotify text-sm font-normal">
                {{ getDateFromNow(track.lastPlayedAt) }}
              </div>
            </div>
          </div>
        </div>
      </div>
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
