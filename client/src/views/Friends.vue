<template>
  <h1 class="h-title">Friends</h1>
  <loading-spinner v-if="loading" />
  <div v-else class="flex flex-col gap-4 sm:gap-3 lg:w-1/2 xl:w-1/4">
    <router-link
      class="
        hover:bg-gray-700-spotify
        sm:p-2
        p-0
        sm:rounded-lg
        rounded-full
        cursor-pointer
      "
      v-for="item in friendsSortedByLastLogin"
      :key="item.customID"
      :to="{ name: 'profile', params: { id: item.customID } }"
    >
      <div class="flex flex-row gap-4 items-center">
        <base-img
          :src="item.avatar"
          :alt="item.customID"
          avatar
          class="w-16 h-16 object-cover rounded-full flex-shrink-0"
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
</template>

<script>
import { getFriends } from "@/api";
import { getDateFromNow } from "@/utils/formatters";
import BaseImg from "@/components/BaseImg.vue";

export default {
  name: "Friends",
  components: { BaseImg },
  data() {
    return {
      loading: true,
      friends: [],
    };
  },
  computed: {
    friendsSortedByLastLogin() {
      return this.orderByDate(this.friends, "lastLogin").reverse();
    },
  },
  async created() {
    const { friends } = await getFriends();
    this.friends = friends;
    this.loading = false;
  },
  methods: {
    getDateFromNow,
    orderByDate(array, key) {
      return array.sort(
        (a, b) => new Date(a[key]).getTime() - new Date(b[key]).getTime()
      );
    },
  },
};
</script>
