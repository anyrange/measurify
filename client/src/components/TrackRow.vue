<template>
  <div
    class="
      hover:bg-gray-700-spotify hover:bg-opacity-30
      flex flex-row
      items-center
      duration-100
      rounded
      gap-3
      px-1
      py-1
    "
    :class="{ 'bg-gray-800-spotify bg-opacity-50': current }"
  >
    <div v-if="place !== false" class="w-6">
      <span class="text-base font-normal">
        {{ place }}
      </span>
    </div>
    <div class="flex flex-row flex-1 truncate items-center gap-3">
      <router-link
        class="flex-shrink-0 flex-none"
        :to="{ name: 'track', params: { trackId: track.id } }"
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
          :to="{ name: 'track', params: { trackId: track.id } }"
        >
          {{ track.name }}
        </router-link>
        <multi-router
          class="text-sm leading-4"
          customClass="hover:no-underline sm:hover:underline pointer-events-none sm:pointer-events-auto"
          :routes="track.artists"
        />
      </div>
    </div>
    <div class="flex-1 md:flex hidden link truncate">
      <router-link :to="{ name: 'album', params: { albumId: track.album.id } }">
        {{ track.album.name }}
      </router-link>
    </div>
    <div class="w-10 lg:flex hidden text-center">
      <span>
        {{ getDuration(track.duration_ms) }}
      </span>
    </div>
    <div class="w-1/4 ml-auto mr-1 text-right">
      <template v-if="track.played_at || current">
        <slot name="current-track">
          <span :title="formatDate(track.played_at)">
            {{ getDateFromNow(track.played_at) }}
          </span>
        </slot>
      </template>
      <template v-else>
        <span>{{ track.plays }} plays</span>
      </template>
    </div>
  </div>
</template>

<script>
import { getDateFromNow, getDuration, formatDate } from "@/utils/formatters";
import MultiRouter from "@/components/MultiRouter.vue";
import BaseImg from "@/components/BaseImg.vue";

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
    current: {
      type: Boolean,
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
    formatDate,
  },
};
</script>
