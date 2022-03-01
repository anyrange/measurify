<template>
  <div class="flex flex-row gap-2 items-center w-full">
    <base-link
      :to="{ name: 'profile', params: { username: friend.username } }"
      class="flex-none rounded-full"
    >
      <base-img
        class="
          w-12
          h-12
          rounded-full
          object-cover
          hover:opacity-50
          duration-200
        "
        :src="friend.avatar"
        :alt="friend.username"
        image-type="profile"
      />
    </base-link>
    <div class="flex flex-col w-full">
      <div class="flex w-full gap-2 items-center justify-between">
        <base-link
          :to="{ name: 'profile', params: { username: friend.username } }"
          class="link line-clamp-1"
        >
          {{ friend.display_name }}
        </base-link>
        <template v-if="friend.lastPlayed">
          <span class="justify-end" :title="getRealtiveTime(friend.lastPlayed)">
            {{ getShortRelativeTime(friend.lastPlayed) }}
          </span>
        </template>
      </div>
      <template v-if="friend.lastTrack">
        <div class="flex items-center">
          <icon icon="entypo:beamed-note" class="mr-1 h-4 w-4" />
          <base-link
            :to="{
              name: 'track',
              params: {
                trackId: friend.lastTrack.id,
              },
            }"
            class="flex w-full hover:underline"
          >
            <span class="line-clamp-1">
              {{ friend.lastTrack.name }}
            </span>
          </base-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { getShortRelativeTime, getRealtiveTime } from "@/utils";

defineProps({
  friend: {
    type: Object,
    required: true,
  },
});
</script>
