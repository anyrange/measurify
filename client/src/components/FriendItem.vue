<template>
  <div class="flex flex-row gap-2 items-center w-full">
    <router-link
      :to="{ name: 'profile', params: { username: friend.username } }"
      class="flex-none"
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
    </router-link>
    <div class="flex flex-col">
      <div class="fullwidth">
        <div class="flex flex-row gap-2 items-center justify-between w-full">
          <router-link
            :to="{ name: 'profile', params: { username: friend.username } }"
            class="link truncate"
          >
            {{ friend.display_name }}
          </router-link>
          <span class="flex flex-none justify-end truncate">
            <template v-if="currentTrack">
              <img
                :src="nowPlaying"
                class="w-3 h-3"
                alt="Listening Now"
                title="now"
              />
            </template>
            <span v-else :title="getDateFromNow(friend.lastPlayed)">
              {{ getDateFromNowShort(friend.lastPlayed) }}
            </span>
          </span>
        </div>
      </div>
      <div class="fullwidth">
        <router-link
          :to="{
            name: 'track',
            params: {
              trackId: track.id,
            },
          }"
          class="flex w-full truncate hover:underline"
        >
          {{ track.name }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { getProfileCurrentTrack } from "@/api";
import { getDateFromNowShort, getDateFromNow } from "@/utils";
import nowPlaying from "@/assets/media/now_playing.gif";
import BaseImg from "@/components/BaseImg.vue";

const props = defineProps({
  friend: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["listening-now"]);

const currentTrack = ref(null);
const interval = ref(null);

const track = computed(() =>
  currentTrack.value ? currentTrack.value : props.friend.lastTrack
);

interval.value = setInterval(async () => {
  const track = await getProfileCurrentTrack({
    username: props.friend.username,
  });
  const setTrack = () => {
    emit("listening-now", props.friend.username);
    currentTrack.value = track;
  };
  track ? setTrack() : clearInterval(interval.value);
}, 120000);
</script>
