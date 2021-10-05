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
          <div class="truncate">
            <router-link
              :to="{ name: 'profile', params: { username: friend.username } }"
              class="link truncate"
            >
              {{ friend.display_name }}
            </router-link>
          </div>
          <span class="flex flex-none justify-end truncate">
            <template v-if="currentTrack">
              <img
                :src="$options.nowPlaingGif"
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

<script>
import { getProfileCurrentTrack } from "@/api";
import { getDateFromNowShort, getDateFromNow } from "@/utils/formatters";
import BaseImg from "@/components/BaseImg.vue";
import nowPlaingGif from "@/assets/now_playing.gif";

export default {
  name: "FriendItem",
  components: {
    BaseImg,
  },
  props: {
    friend: {
      type: Object,
      required: true,
    },
  },
  emits: { "listening-now": null },
  data() {
    return {
      currentTrack: null,
      interval: null,
    };
  },
  nowPlaingGif,
  computed: {
    track() {
      return this.currentTrack ? this.currentTrack : this.friend.lastTrack;
    },
  },
  async created() {
    this.currentTrack = await getProfileCurrentTrack({
      username: this.friend.username,
    });
    if (this.currentTrack) {
      this.$emit("listening-now", this.friend.username);
      this.interval = setInterval(async () => {
        this.currentTrack = await getProfileCurrentTrack({
          username: this.friend.username,
        });
        if (!this.currentTrack) {
          clearInterval(this.interval);
        }
      }, 120000);
    }
  },
  methods: {
    getDateFromNowShort,
    getDateFromNow,
  },
};
</script>
