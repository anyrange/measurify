<template>
  <div class="flex flex-col gap-3">
    <div v-for="(item, index) in tracks" :key="index">
      <router-link
        :to="{ name: 'track', params: { id: item.id } }"
        class="
          flex flex-row
          items-center
          gap-3
          pr-3
          hover:bg-gray-700-spotify
          duration-100
          rounded-lg
        "
      >
        <base-img
          :src="item.image"
          :alt="item.name"
          class="w-16 h-16 object-cover rounded-lg"
        />
        <div class="flex flex-col">
          <div class="text-white sm:w-full w-48 overflow-hidden truncate">
            {{ item.name }}
          </div>
          <div
            class="
              flex flex-row
              text-sm
              sm:w-full
              w-48
              items-center
              overflow-hidden
              truncate
            "
          >
            <multi-router
              color="text-gray-400-spotify"
              :routes="item.artists"
            />
          </div>
          <div class="text-gray-500-spotify text-sm font-normal">
            {{ getDateFromNow(item.played_at) }}
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import BaseImg from "@/components/BaseImg.vue";
import { getDateFromNow } from "@/utils/formatters";
import MultiRouter from "@/components/MultiRouter.vue";

export default {
  name: "TracksList",
  props: {
    tracks: {
      type: Array,
      required: true,
    },
  },
  components: {
    BaseImg,
    MultiRouter,
  },
  methods: {
    getDateFromNow,
  },
};
</script>
