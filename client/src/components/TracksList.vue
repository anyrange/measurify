<template>
  <div class="w-full table table-fixed">
    <div class="flex flex-col gap-3">
      <div
        class="
          flex flex-row
          items-center
          gap-2
          min-w-0
          duration-100
          rounded-lg
          pr-3
        "
        v-for="item in tracks"
        :key="item.id"
      >
        <router-link
          class="flex-shrink-0"
          :to="{ name: 'track', params: { id: item.id } }"
        >
          <base-img
            :src="item.image"
            :alt="item.name"
            class="w-16 h-16 object-cover rounded-lg"
          />
        </router-link>
        <div class="w-full flex flex-col truncate">
          <router-link
            class="link truncate"
            :to="{ name: 'track', params: { id: item.id } }"
          >
            {{ item.name }}
          </router-link>
          <div class="flex w-full flex-row text-sm items-center">
            <multi-router :routes="item.artists" />
          </div>
          <span class="text-gray-500-spotify text-sm font-normal">
            {{ getDateFromNow(item.played_at) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseImg from "@/components/BaseImg.vue";
import MultiRouter from "@/components/MultiRouter.vue";
import { getDateFromNow } from "@/utils/formatters";

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
