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
      <div class="flex flex-row items-center p-3 justify-between">
        <div class="flex flex-row items-center gap-3">
          <base-img
            class="object-cover w-12 h-12 rounded-full"
            image-type="profile"
            :src="userStore.user.avatar"
            alt="profile avatar"
          />
          <div class="flex flex-col">
            <p class="text-lg font-medium text-gray-400-spotify">
              {{ userStore.user.display_name }}
            </p>
            <p class="text-sm text-gray-500-spotify">Open profile</p>
          </div>
        </div>
        <div class="flex flex-row items-center">
          <icon class="w-6 h-6" icon="ic:baseline-keyboard-arrow-right" />
        </div>
      </div>
    </base-link>
  </div>
</template>

<script setup>
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
</script>
