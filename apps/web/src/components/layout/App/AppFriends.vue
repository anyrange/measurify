<template>
  <template v-if="showFriends">
    <aside class="hidden w-60 flex-col px-2 md:flex">
      <div class="default-border h-12 flex items-center border-b text-white">
        <div class="w-full flex items-center justify-between">
          <span class="font-medium text-lg">Friend Activity</span>
          <base-button shape="circle">
            <base-link :to="{ name: 'search' }">
              <icon
                class="block h-4 w-4 hover:cursor-pointer"
                icon="ant-design:user-add-outlined"
              />
            </base-link>
          </base-button>
        </div>
      </div>
      <template v-if="isAuthenticated">
        <ul class="h-full overflow-y-auto">
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
        <p class="mt-2 font-light text-center text-white">
          Sign In with your Spotify account to see your friends activity
        </p>
      </template>
    </aside>
  </template>
</template>

<script setup>
import { watch, computed } from "vue"
import { storeToRefs } from "pinia"
import { useAuth } from "@/composable/useAuth"
import { useFriendsStore } from "@/stores/friends"

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
    required: true,
  },
})

const showFriends = computed(() => {
  return props.show
})

const friendsStore = useFriendsStore()

const { isAuthenticated } = useAuth()

const { friendsSortedByLastListened, friends } = storeToRefs(friendsStore)

watch(
  showFriends,
  (show) => {
    if (show) {
      friendsStore.updateFriends()
    }
  },
  {
    immediate: true,
  }
)
</script>

<style>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

.list-leave-active {
  position: absolute;
}
</style>
