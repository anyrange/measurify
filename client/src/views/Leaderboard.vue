<template>
  <div class="flex flex-col gap-3">
    <h1 class="h-title">Leaderboard</h1>
    <h2 class="h-subtitle">
      This rating is based on the number of listened minutes
    </h2>
  </div>
  <loading-spinner v-if="loading" />
  <div v-else class="flex flex-col gap-y-2 lg:w-1/3 xl:w-1/4">
    <div
      v-for="(item, index) in leaderboard"
      :key="item.id"
      class="flex flex-row p-2 items-center w-full bg-opacity-20 rounded-lg"
      :class="[
        privateProfile(item) ? 'opacity-30' : 'opacity-100',
        item.userName === user.username
          ? 'bg-gray-500-spotify'
          : 'bg-gray-600-spotify',
      ]"
    >
      <div class="flex flex-none w-10 ml-4 text-lg font-extrabold">
        <span>
          {{ index + 1 }}
        </span>
      </div>
      <div class="flex flex-row items-center">
        <div class="flex flex-col flex-none">
          <router-link
            :class="{ 'pointer-events-none': privateProfile(item) }"
            :to="{ name: 'profile', params: { id: item.customID } }"
          >
            <div class="relative">
              <base-img
                class="text-white object-cover w-11 h-11 rounded-full"
                avatar
                :src="item.avatar"
                :alt="item.userName"
              />
              <lock
                v-if="privateProfile(item)"
                class="cursor-not-allowed inset-center"
              />
            </div>
          </router-link>
        </div>
        <div class="flex flex-col ml-4 truncate">
          <router-link
            class="text-base text-white truncate"
            :class="[
              privateProfile(item) ? 'pointer-events-none' : 'hover:underline',
            ]"
            :to="{ name: 'profile', params: { id: item.customID } }"
          >
            {{ item.userName }}
          </router-link>
          <span class="text-base font-semibold text-gray-500-spotify">
            {{ item.listened }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getListenersTop } from "@/api";
import { Lock } from "@/components/icons";
import { mapGetters } from "vuex";
import BaseImg from "@/components/BaseImg.vue";

export default {
  name: "Leaderboard",
  components: { Lock, BaseImg },
  data() {
    return {
      loading: true,
      leaderboard: {},
    };
  },
  computed: {
    ...mapGetters({ user: "getUser" }),
  },
  created() {
    getListenersTop().then((response) => {
      this.leaderboard = response.top;
      this.loading = false;
    });
  },
  methods: {
    privateProfile(item) {
      if (!item.canSee & (item.userName != this.user.username)) return true;
      return false;
    },
  },
};
</script>
