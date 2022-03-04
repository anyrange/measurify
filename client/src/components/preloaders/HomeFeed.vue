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
          bg-secondary-darkest
          font-medium
          text-lg text-secondary-lighter
          border-b border-secondary
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
import { ref } from "vue";
import { useInfiniteScroll } from "@vueuse/core";
import { getFeed } from "@/api";
import { formatDate } from "@/utils";

const feedList = ref(null);

const pages = ref(1);
const page = ref(1);
const feed = ref(null);

const { userActivity, pages: pagesData } = await getFeed(page.value);

feed.value = userActivity;
pages.value = pagesData;

useInfiniteScroll(
  feedList,
  async () => {
    if (page.value >= pages.value) return;

    page.value++;

    const { userActivity, pages: pagesData } = await getFeed(page.value);

    pages.value = pagesData;

    const data = Object.entries(userActivity);

    data.forEach(([date, data]) => {
      if (feed.value[date] !== undefined) {
        const feedLength = feed.value[date].length;
        if (feed.value[date][feedLength - 1].username === data[0].username) {
          const firstItem = data.shift();
          feed.value[date][feedLength - 1].tracks.push(...firstItem.tracks);
        }
        feed.value[date] = [...feed.value[date], ...data];
        return;
      }

      feed.value[date] = data;
    });
  },
  { distance: 300 }
);
</script>
