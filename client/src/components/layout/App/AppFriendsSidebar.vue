<template>
  <template v-if="showFriends">
    <aside class="hidden md:flex flex-col w-60 px-2">
      <div class="h-12 flex items-center border-b default-border text-white">
        <div class="flex w-full justify-between items-center">
          <span class="text-lg font-medium">Friend Activity</span>
          <base-button shape="circle">
            <base-link :to="{ name: 'search' }">
              <icon
                class="w-4 h-4 hover:cursor-pointer"
                icon="ant-design:user-add-outlined"
              />
            </base-link>
          </base-button>
        </div>
      </div>
      <template v-if="isAuthenticated">
        <ul class="overflow-y-auto h-full">
          <template v-if="!friends">
            <loading-spinner />
          </template>
          <template v-else>
            <transition-group class="flex flex-col gap-3" name="list" tag="ul">
              <li
                v-for="friend in friendsSortedByLastListened"
                :key="friend.username"
                class="first:mt-2"
              >
                <friend-item :friend="friend" />
              </li>
            </transition-group>
          </template>
        </ul>
      </template>
      <template v-else>
        <p class="mt-2 text-white font-light text-center">
          Sign In with your Spotify account to see your spotiworm followers
          activity
        </p>
      </template>
    </aside>
  </template>
</template>

<script setup>
import { watch, computed } from "vue";
import { storeToRefs } from "pinia";
import { useAuth } from "@/composable/useAuth";
import { useFriendsStore } from "@/stores/friends";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const showFriends = computed(() => {
  return props.show;
});

const friendsStore = useFriendsStore();

const { isAuthenticated } = useAuth();

const { friendsSortedByLastListened, friends } = storeToRefs(friendsStore);

watch(
  showFriends,
  (show) => {
    if (show) {
      friendsStore.updateFriends();
    }
  },
  {
    immediate: true,
  }
);
</script>
