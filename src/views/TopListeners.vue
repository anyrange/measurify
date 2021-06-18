<template>
  <h2 class="h-title">Top Listeners</h2>
  <h3 class="h-subtitle mt-4">
    This rating is based on the number of listened tracks
  </h3>
  <loading-spinner v-if="loading" />
  <template v-else>
    <div class="mt-6">
      <div v-for="(item, index) in leaderboard" :key="item.id">
        <div class="p-1 lg:w-1/3 xl:w-1/4">
          <div
            class="flex p-2 flex-row items-center w-full bg-gray-600-spotify bg-opacity-20 rounded-lg"
            :class="{
              'opacity-50': item.private & (item.userName != user.username),
              'bg-gray-500-spotify': item.userName === user.username,
            }"
          >
            <div class="mr-6 ml-2 text-lg font-extrabold text-gray-300">
              {{ index + 1 }}
            </div>
            <router-link
              class="text-base text-gray-100"
              :class="[
                !item.private || item.userName === user.username
                  ? 'select-none'
                  : 'cursor-pointer',
              ]"
              :to="{ name: 'profile', params: { id: item.customID } }"
            >
              <div class="flex flex-row items-center">
                <div class="flex flex-col">
                  <div class="relative">
                    <base-img
                      class="text-white object-cover w-11 h-11 rounded-full"
                      avatar
                      :src="item.avatar"
                      :alt="item.userName"
                    />
                    <lock
                      v-if="item.private & (item.userName != user.username)"
                      class="cursor-not-allowed inset-center"
                    />
                  </div>
                </div>
                <div class="flex flex-col ml-4">
                  <div>
                    <div
                      v-if="!item.private || item.userName === user.username"
                    >
                      {{ item.userName }}
                    </div>
                    <div v-else class="text-base text-gray-100 select-none">
                      {{ item.userName }}
                    </div>
                  </div>
                  <div class="text-base font-bold text-gray-500-spotify">
                    {{ item.listened }}
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<script>
import { getListenersTop } from "@/api";
import { Lock } from "@/components/icons";
import { mapGetters } from "vuex";
import BaseImg from "@/components/BaseImg.vue";

export default {
  name: "TopListeners",
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
};
</script>
