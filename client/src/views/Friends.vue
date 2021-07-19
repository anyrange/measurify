<template>
  <h2 class="h-title">Friends</h2>
  <loading-spinner v-if="loading" />
  <template v-else>
    <div class="mt-6 flex flex-col gap-3 lg:w-1/2 xl:w-1/4">
      <div
        v-for="item in friends"
        :key="item.customID"
        class="hover:bg-gray-700-spotify p-2 rounded-lg cursor-pointer"
      >
        <router-link :to="{ name: 'profile', params: { id: item.customID } }">
          <div class="flex flex-row gap-4 items-center">
            <base-img
              :src="item.avatar"
              :alt="item.customID"
              avatar
              class="w-16 h-16 object-cover rounded-full"
            />
            <div class="flex flex-col">
              <div class="text-white text-base font-medium">
                {{ item.userName }}
              </div>
              <div class="text-gray-500-spotify text-sm font-normal">
                last seen {{ getDateFromNow(item.lastLogin) }}
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </template>
</template>

<script>
import { getFriends } from "@/api";
import BaseImg from "@/components/BaseImg.vue";
import { formatDistanceToNowStrict } from "date-fns";

export default {
  name: "Friends",
  components: { BaseImg },
  data() {
    return {
      loading: true,
      friends: [],
    };
  },
  created() {
    getFriends().then((response) => {
      this.friends = response.friends;
      this.loading = false;
    });
  },
  methods: {
    getDateFromNow(date) {
      return formatDistanceToNowStrict(Date.parse(date), {
        addSuffix: true,
      });
    },
  },
};
</script>
