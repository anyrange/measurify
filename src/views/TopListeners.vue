<template>
  <h2 class="h-title">Top Listeners</h2>
  <loading-spinner v-if="loading" />
  <template v-else>
    <div class="mt-10">
      <div v-for="(item, index) in leaderboard" :key="item.id">
        <div class="flex items-center">
          <div
            class="flex items-center rounded-md p-2 lg:w-1/2 xl:w-1/4 w-full justify-between"
          >
            <div class="text-base font-bold text-gray-300">
              {{ index + 1 }}
            </div>
            <div
              class="flex justify-between w-11/12 items-center bg-gray-900-spotify md:p-2 p-1 rounded-full"
              :class="{
                'opacity-50': item.private,
              }"
            >
              <div class="flex items-center">
                <template v-if="!item.private">
                  <template v-if="item.avatar">
                    <img
                      class="object-cover w-10 h-10 rounded-full"
                      :src="item?.avatar"
                      :alt="item.userName"
                    />
                  </template>
                  <template v-else>
                    <user-icon class="text-white w-10 h-10" />
                  </template>
                  <router-link
                    class="ml-4 text-base text-gray-100 hover:underline"
                    :to="{
                      name: 'profile',
                      params: {
                        id: item.customID,
                      },
                    }"
                  >
                    {{ item.userName }}
                  </router-link>
                </template>
                <template v-else>
                  <div class="relative">
                    <template v-if="item.avatar">
                      <img
                        class="object-cover w-10 h-10 rounded-full"
                        :src="item?.avatar"
                        :alt="item.userName"
                      />
                    </template>
                    <template v-else>
                      <user-icon class="text-white w-10 h-10" />
                    </template>
                    <div
                      v-if="item.private"
                      class="cursor-not-allowed inset-center"
                    >
                      <lock />
                    </div>
                  </div>
                  <div class="ml-4 text-base text-gray-100 select-none">
                    {{ item.userName }}
                  </div>
                </template>
              </div>
              <div class="flex items-center text-gray-300">
                <div class="mr-2 text-base font-bold">
                  {{ item.listened }}
                </div>
                <div>
                  <time-icon class="w-5 h-5 mx-2 opacity-80" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<script>
import api from "@/api";
import { TimeIcon, Lock, UserIcon } from "@/components/icons";

export default {
  components: { TimeIcon, Lock, UserIcon },
  data() {
    return {
      loading: true,
      leaderboard: {},
    };
  },
  methods: {
    fetchSettings() {
      api
        .getListenersTop()
        .then((response) => {
          this.leaderboard = response;
        })
        .finally(() => {
          this.loading = false;
        })
        .catch((error) => {
          this.$notify.show({
            type: "danger",
            message: error.response.data.message,
          });
        });
    },
  },
  created() {
    this.fetchSettings();
  },
};
</script>
