<template>
  <div class="fullwidth">
    <div class="flex flex-col gap-2 sm:gap-3">
      <div
        class="
          flex flex-row
          items-center
          gap-2
          min-w-0
          duration-100
          rounded-lg
          pr-3
          sm:bg-transparent
          bg-gray-600-spotify bg-opacity-20
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
            class="sm:w-16 sm:h-16 w-12 h-12 object-cover rounded-lg"
          />
        </router-link>
        <div
          class="
            truncate
            w-full
            flex
            sm:flex-col
            flex-row
            gap-2
            sm:gap-0
            items-center
            sm:items-start
            justify-between
            sm:justify-center
          "
        >
          <div class="flex flex-col truncate">
            <router-link
              class="link truncate"
              :to="{ name: 'track', params: { id: item.id } }"
            >
              {{ item.name }}
            </router-link>
            <div class="flex w-full flex-row text-sm items-center">
              <multi-router :routes="item.artists" />
            </div>
          </div>
          <span
            class="flex flex-grow-0 text-gray-500-spotify text-sm font-normal"
          >
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
