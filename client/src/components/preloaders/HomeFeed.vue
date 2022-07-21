<template>
  <div
    id="feedList"
    ref="feedList"
    class="-mb-4 h-screen max-h-screen w-full flex flex-col overflow-scroll"
  >
    <div
      class="w-full flex flex-col gap-1.5"
      v-for="(item, date) in feed"
      :key="item"
    >
      <div
        class="
          sticky
          top-0
          z-99
          border-b border-secondary
          bg-secondary-darkest
          font-medium
          text-lg text-secondary-lighter
        "
      >
        {{ formatDate(date) }}
      </div>
      <div class="flex flex-col gap-3">
        <div class="flex flex-row" v-for="(user, index) in item" :key="index">
          <friend-item :friend="user">
            <template #sub>
              <span class="text-secondary-lighter text-sm">
                Listened to {{ user.tracks.length }}
                {{ user.tracks.length === 1 ? "track" : "tracks" }}
              </span>
              <div class="mt-2">
                <track-rows>
                  <track-row
                    v-for="(track, trackIndex) in user.tracks"
                    :key="trackIndex"
                    :track="{
                      ...track,
                      album: false,
                      duration: false,
                    }"
                    date
                  />
                </track-rows>
              </div>
            </template>
          </friend-item>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, shallowRef } from "vue";
import { useInfiniteScroll } from "@vueuse/core";
import { getFeed } from "@/api";
import { formatDate } from "@/utils";

const feedList = shallowRef(null);

const metainfo = ref([]);
const feed = ref(null);

const { userActivity, meta: metaData } = await getFeed(metainfo.value);

feed.value = userActivity;
metainfo.value = metaData;

useInfiniteScroll(
  feedList,
  async () => {
    const { userActivity, meta: metaData } = await getFeed(metainfo.value);

    metainfo.value = metaData;
    const data = Object.entries(userActivity);

    data.forEach(([date, data]) => {
      if (feed.value[date] !== undefined) {
        const lastItem = feed.value[date].at(-1);

        if (lastItem.username === data[0].username) {
          const firstItem = data.shift();
          lastItem.tracks.push(...firstItem.tracks);
        }

        data.forEach((item) => {
          if (!item) return;
          feed.value[date].push(item);
        });
        return;
      }
      feed.value[date] = data;
    });
  },
  { distance: 500 }
);
</script>
