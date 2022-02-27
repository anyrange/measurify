<template>
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
    <template v-if="userStore.isAuthenticated">
      <ul class="flex flex-col gap-3 overflow-y-auto h-full">
        <suspense>
          <friends-details class="first:mt-2" />
          <template #fallback>
            <loading-spinner />
          </template>
        </suspense>
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

<script setup>
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
</script>
