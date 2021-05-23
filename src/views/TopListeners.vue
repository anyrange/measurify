<template>
  <h2 class="h-title">Top Listeners</h2>
  <h3 class="h-subtitle mt-4">
    This rating is based on the number of listened to tracks
  </h3>
  <loading-spinner v-if="loading" />
  <template v-else>
    <div class="mt-6">
      <div v-for="(item, index) in leaderboard" :key="item.id">
        <div class="p-1 lg:w-1/3 xl:w-1/4">
          <div
            class="flex p-2 flex-row items-center w-full bg-gray-600-spotify bg-opacity-20 rounded-lg"
            :class="{
              'opacity-50': item.private & (item.userName != user.display_name),
              'bg-gray-500-spotify': item.userName === user.display_name,
            }"
          >
            <div class="mr-6 ml-2 text-lg font-extrabold text-gray-300">
              {{ index + 1 }}
            </div>
            <div class="flex flex-row items-center">
              <div class="flex flex-col">
                <div class="relative">
                  <img
                    v-if="item.avatar"
                    class="object-cover w-11 h-11 rounded-full"
                    :src="item?.avatar"
                    :alt="item.userName"
                  />
                  <user-icon v-else class="text-white w-11 h-11" />
                  <lock
                    v-if="item.private & (item.userName != user.display_name)"
                    class="cursor-not-allowed inset-center"
                  />
                </div>
              </div>
              <div class="flex flex-col ml-4">
                <div>
                  <router-link
                    class="text-base text-gray-100 hover:underline"
                    v-if="!item.private || item.userName === user.display_name"
                    :to="{
                      name: 'profile',
                      params: {
                        id: item.customID,
                      },
                    }"
                  >
                    {{ item.userName }}
                  </router-link>
                  <div class="text-base text-gray-100 select-none" v-else>
                    {{ item.userName }}
                  </div>
                </div>
                <div class="text-base font-bold text-gray-500-spotify">
                  {{ item.listened }}
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
import { Lock, UserIcon } from "@/components/icons";
import { mapGetters } from "vuex";

export default {
  components: { Lock, UserIcon },
  data() {
    return {
      loading: true,
      leaderboard: {},
    };
  },
  computed: {
    ...mapGetters({
      user: "getUser",
    }),
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
