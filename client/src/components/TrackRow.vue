<template>
  <div
    class="
      hover:bg-gray-700-spotify hover:bg-opacity-30
      flex flex-row
      items-center
      duration-75
      rounded
      gap-3
      px-1
      py-1
    "
  >
    <div class="w-6" v-if="place !== false">
      <span class="text-base font-normal">
        {{ place }}
      </span>
    </div>
    <div class="flex flex-row flex-1 truncate items-center gap-3">
      <router-link
        class="flex-shrink-0 flex-none"
        :to="{ name: 'track', params: { id: track.id } }"
      >
        <base-img
          class="w-11 h-11 object-cover"
          :src="track.image"
          :alt="track.name"
          image-type="track"
        />
      </router-link>
      <div>
        <router-link
          class="link text-sm"
          :to="{ name: 'track', params: { id: track.id } }"
        >
          {{ track.name }}
        </router-link>
        <multi-router
          v-if="track.artists"
          class="text-sm leading-4"
          customClass="hover:no-underline sm:hover:underline pointer-events-none sm:pointer-events-auto"
          :routes="track.artists"
        />
      </div>
    </div>
    <div class="flex-1 md:flex hidden link truncate" v-if="track.album">
      <router-link :to="{ name: 'album', params: { id: track.album.id } }">
        {{ track.album.name }}
      </router-link>
    </div>
    <div class="w-10 lg:flex hidden text-center" v-if="track.duration_ms">
      <h4>
        {{ getDuration(track.duration_ms) }}
      </h4>
    </div>
    <span class="w-1/4 ml-auto mr-1 text-right" v-if="track.played_at">
      {{ getDateFromNow(track.played_at) }}
    </span>
  </div>
</template>

<script>
import { getDateFromNow, getDuration } from "@/utils/formatters";
import MultiRouter from "@/components/MultiRouter";
import BaseImg from "@/components/BaseImg";

export default {
  name: "TracksRow",
  props: {
    track: {
      type: Object,
      required: true,
    },
    place: {
      type: [Number, Boolean],
      required: false,
      default: false,
    },
  },
  components: {
    BaseImg,
    MultiRouter,
  },
  methods: {
    getDateFromNow,
    getDuration,
  },
};
</script>