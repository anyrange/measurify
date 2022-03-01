<template>
  <div class="h-screen">
    <template v-if="loading">
      <loading-spinner />
    </template>
    <template v-else>
      <div
        class="flex flex-col h-screen text-sm text-gray-500-spotify"
        :class="{ 'custom-scrollbar': !isMobile }"
      >
        <div class="flex-1 flex overflow-y-hidden">
          <app-navigation-sidebar />
          <main class="flex-1 flex flex-col bg-gray-900-spotify relative">
            <div
              id="content-window"
              class="
                overflow-y-auto
                flex flex-col
                h-full
                p-4
                mb-12
                sm:px-8 sm:mb-0
              "
            >
              <router-view />
            </div>
          </main>
          <app-friends-sidebar :show="xlAndLarger" />
        </div>
      </div>
    </template>
    <notifications />
  </div>
</template>

<script setup>
import { provide } from "vue";
import { useNavigator } from "@/composable/useNavigator";
import { createAsyncProcess } from "@/composable/useAsync";
import { useUserStore } from "@/stores/user";
import { useBreakpoints } from "@/composable/useBreakpoints";

const userStore = useUserStore();
const { isMobile } = useNavigator();
const { xlAndLarger } = useBreakpoints();

provide("historyLength", window.history.length);

const { loading, run } = createAsyncProcess(userStore.updateUser);

run();
</script>
