<template>
  <h1 class="h-title">Friends</h1>
  <loading-spinner v-if="loading" />
  <div v-else class="flex flex-col gap-4 xl:w-1/2 2xl:w-1/4">
    <router-link
      v-for="item in friendsSortedByLastLogin"
      :key="item.username"
      class="
        hover:bg-gray-700-spotify hover:bg-opacity-30
        rounded-full
        cursor-pointer
        flex flex-row
        gap-4
        items-center
      "
      :to="{ name: 'profile', params: { username: item.username } }"
    >
      <base-img
        :src="item.avatar"
        :alt="item.username"
        image-type="profile"
        avatar
        class="w-16 h-16 object-cover rounded-full flex-shrink-0"
      />
      <div class="flex flex-col">
        <div class="text-white text-base font-medium">
          {{ item.display_name }}
        </div>
        <div class="text-gray-500-spotify text-sm font-normal">
          last seen {{ getDateFromNow(item.lastLogin) }}
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import { getFriends } from "@/api";
import { getDateFromNow } from "@/utils/formatters";
import { orderByDate } from "@/utils/arrays";
import BaseImg from "@/components/BaseImg.vue";

export default {
  components: {
    BaseImg,
  },
  data() {
    return {
      loading: true,
      friends: [],
    };
  },
  computed: {
    friendsSortedByLastLogin() {
      return this.orderByDate(this.friends, "lastLogin");
    },
  },
  async created() {
    const { friends } = await getFriends();
    this.friends = friends;
    this.loading = false;
  },
  methods: {
    getDateFromNow,
    orderByDate,
  },
};
</script>
