<template>
  <div class="w-full flex flex-row items-start gap-2">
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
    <div class="mt-1 w-full flex flex-col">
      <div class="fullwidth">
        <div class="w-full flex items-center justify-between gap-2">
          <base-link
            :to="{ name: 'profile', params: { username: friend.username } }"
            class="link truncate"
          >
            {{ friend.display_name }}
          </base-link>
          <slot name="top-right">
            <template v-if="friend.lastPlayed">
              <div class="flex flex-none justify-end truncate">
                <span :title="getRealtiveTime(friend.lastPlayed)">
                  {{ getShortRelativeTime(friend.lastPlayed) }}
                </span>
              </div>
            </template>
          </slot>
        </div>
      </div>
      <div class="fullwidth">
        <slot name="sub">
          <template v-if="friend.lastTrack">
            <div class="flex items-center">
              <icon icon="entypo:beamed-note" class="mr-1 h-4 w-4" />
              <base-link
                class="w-full flex truncate hover:underline"
                :to="{
                  name: 'track',
                  params: {
                    trackId: friend.lastTrack.id,
                  },
                }"
              >
                {{ friend.lastTrack.name }}
              </base-link>
            </div>
          </template>
        </slot>
      </div>
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
