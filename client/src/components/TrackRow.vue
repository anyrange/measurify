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
    <div v-if="place !== false" class="w-6 text-base font-normal">
      {{ place }}
    </div>
    <figure class="flex flex-row flex-1 truncate items-center gap-3">
      <router-link
        class="flex-shrink-0 flex-none"
        :to="{ name: 'track', params: { trackId: track.id } }"
      >
        <base-img
          class="w-11 h-11 object-cover"
          image-type="track"
          :src="track.image"
          :alt="track.name"
        />
      </router-link>
      <figcaption class="truncate">
        <router-link
          class="link text-sm"
          :to="{ name: 'track', params: { trackId: track.id } }"
        >
          {{ track.name }}
        </router-link>
        <div class="truncate">
          <multi-router
            custom-class="text-sm leading-4 hover:no-underline sm:hover:underline pointer-events-none sm:pointer-events-auto"
            :routes="track.artists"
          />
        </div>
      </figcaption>
    </figure>
    <div v-if="track.album !== false" class="flex-1 md:flex hidden truncate">
      <router-link
        class="truncate link"
        :to="{ name: 'album', params: { albumId: track.album.id } }"
      >
        {{ track.album.name }}
      </router-link>
    </div>
    <div class="w-10 lg:flex hidden text-center">
      {{ getDuration(track.duration_ms) }}
    </div>
    <div v-if="playsOrDate !== false" class="w-1/4 ml-auto mr-1 text-right">
      <template v-if="playsOrDate === 'date'">
        <slot name="current-track">
          <span :title="formatDate(track.played_at)">
            {{ getDateFromNow(track.played_at) }}
          </span>
        </slot>
      </template>
      <span v-else-if="playsOrDate === 'plays'">
        {{ track.plays ? `${track.plays} plays` : "not played" }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { getDateFromNow, getDuration, formatDate } from "@/utils";
import MultiRouter from "./MultiRouter.vue";
import BaseImg from "./BaseImg.vue";

defineProps({
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
  playsOrDate: {
    type: [String, Boolean],
    required: true,
  },
});
</script>
