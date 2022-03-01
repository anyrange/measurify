<template>
  <div class="h-screen">
    <template v-if="loading">
      <loading-spinner />
    </template>
    <template v-else>
      <div
        class="h-screen flex flex-col text-gray-500-spotify text-sm"
        :class="{ 'custom-scrollbar': !isMobile }"
      >
        <div class="flex flex-1 overflow-y-hidden">
          <app-navigation-sidebar />
          <main class="flex flex-1 flex-col bg-gray-900-spotify">
            <div
              id="content-window"
              class="
                overflow-y-auto
                flex flex-col
                h-full
                px-4
                pb-4
                mb-12
                sm:px-8 sm:mb-0
              "
              style="overflow: overlay"
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
