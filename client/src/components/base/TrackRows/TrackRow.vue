<template>
  <li
    class="hover:bg-secondary-darker"
    :class="{ 'bg-secondary-darker': current }"
  >
    <div class="flex flex-row items-center gap-3 rounded px-1 py-1">
      <span v-if="place !== false" class="w-6 font-normal text-base">
        {{ place }}
      </span>
      <div class="flex flex-1 flex-row items-center gap-3 truncate">
        <base-link
          class="flex-none flex-shrink-0"
          :to="{ name: 'track', params: { trackId: track.id } }"
        >
          <base-img
            class="h-12 w-12 object-cover"
            image-type="track"
            :src="track.image"
            :alt="track.name"
          />
        </base-link>
        <div class="truncate">
          <base-link
            class="link text-sm"
            :to="{ name: 'track', params: { trackId: track.id } }"
          >
            {{ track.name }}
          </base-link>
          <div class="truncate">
            <div class="w-full">
              <div class="truncate">
                <artists-names
                  class="
                    truncate
                    pointer-events-none
                    leading-4
                    text-sm
                    hover:no-underline
                    sm:hover:underline sm:pointer-events-auto
                    line-clamp-1
                  "
                  :routes="track.artists"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="track.album !== false"
        class="hidden w-full flex-1 truncate md:flex"
      >
        <base-link
          class="link truncate"
          :to="{ name: 'album', params: { albumId: track.album.id } }"
        >
          {{ track.album.name }}
        </base-link>
      </div>
      <span class="hidden w-10 text-center lg:flex">
        {{ getDuration(track.duration_ms) }}
      </span>
      <div v-if="plays || date" class="ml-auto mr-1 w-1/5 text-right">
        <template v-if="date">
          <slot name="date">
            <span :title="formatDate(track.played_at)">
              {{ getRealtiveTime(track.played_at) }}
            </span>
          </slot>
        </template>
        <span v-if="plays">
          {{
            track.plays
              ? `${track.plays} ${track.plays === 1 ? "play" : "plays"}`
              : ""
          }}
        </span>
      </div>
    </div>
  </li>
</template>

<script setup>
import { getRealtiveTime, getDuration, formatDate } from "@/utils";

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
  plays: {
    type: Boolean,
    required: false,
    default: false,
  },
  date: {
    type: Boolean,
    required: false,
    default: false,
  },
});
</script>
