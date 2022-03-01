<template>
  <div
    class="
      rounded-lg
      cursor-pointer
      duration-150
      bg-secondary-dark
      hover:bg-secondary-light
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
            <p class="font-medium text-lg text-secondary-lighter">
              {{ userStore.user.display_name }}
            </p>
            <p class="text-secondary-lighter text-sm">Open profile</p>
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
