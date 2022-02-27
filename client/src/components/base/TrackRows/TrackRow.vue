<template>
  <li
    class="hover:bg-gray-800-spotify"
    :class="{ 'bg-gray-800-spotify': current }"
  >
    <div class="flex flex-row items-center rounded gap-3 px-1 py-1">
      <span v-if="place !== false" class="w-6 text-base font-normal">
        {{ place }}
      </span>
      <figure class="flex flex-row flex-1 truncate items-center gap-3">
        <base-link
          class="flex-shrink-0 flex-none"
          :to="{ name: 'track', params: { trackId: track.id } }"
        >
          <base-img
            class="w-12 h-12 object-cover"
            image-type="track"
            :src="track.image"
            :alt="track.name"
          />
        </base-link>
        <figcaption class="truncate">
          <base-link
            class="link text-sm"
            :to="{ name: 'track', params: { trackId: track.id } }"
          >
            {{ track.name }}
          </base-link>
          <div class="truncate">
            <multi-router
              custom-class="text-sm leading-4 hover:no-underline sm:hover:underline pointer-events-none sm:pointer-events-auto"
              :routes="track.artists"
            />
          </div>
        </figcaption>
      </figure>
      <div v-if="track.album !== false" class="flex-1 md:flex hidden truncate">
        <base-link
          class="truncate link"
          :to="{ name: 'album', params: { albumId: track.album.id } }"
        >
          {{ track.album.name }}
        </base-link>
      </div>
      <span class="w-10 lg:flex hidden text-center">
        {{ getDuration(track.duration_ms) }}
      </span>
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
  </li>
</template>

<script setup>
import { getDateFromNow, getDuration, formatDate } from "@/utils";

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
