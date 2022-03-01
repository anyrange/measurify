<template>
  <div
    class="
      rounded-lg
      cursor-pointer
      duration-150
      bg-gray-700-spotify
      hover:bg-gray-600-spotify
      select-none
    "
  >
    <base-link
      v-if="userStore.user.username"
      :to="{ name: 'profile', params: { username: userStore.user.username } }"
    >
      <div class="flex flex-row items-center justify-between p-3">
        <div class="flex flex-row items-center gap-3">
          <base-img
            class="h-12 w-12 rounded-full object-cover"
            image-type="profile"
            :src="userStore.user.avatar"
            alt="profile avatar"
          />
          <div class="flex flex-col">
            <p class="font-medium text-gray-400-spotify text-lg">
              {{ userStore.user.display_name }}
            </p>
            <p class="text-gray-500-spotify text-sm">Open profile</p>
          </div>
        </div>
        <div class="flex flex-row items-center">
          <icon class="h-6 w-6" icon="ic:baseline-keyboard-arrow-right" />
        </div>
      </div>
    </base-link>
  </div>
</template>

<script setup>
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
</script>
