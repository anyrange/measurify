<template>
  <div
    class="flex flex-col h-screen text-sm text-gray-500-spotify"
    :class="{ 'custom-scrollbar': !isMobile }"
  >
    <div class="flex-1 flex overflow-y-hidden">
      <the-sidebar />
      <div class="flex-1 flex flex-col bg-gray-900-spotify">
        <main
          id="content-window"
          class="
            overflow-y-auto
            sm:px-8
            px-4
            py-4
            sm:mb-0
            mb-12
            flex flex-col
            gap-4
          "
        >
          <router-view />
        </main>
      </div>
      <friends-list
        v-if="breakpoints.is === 'xl' || breakpoints.is === '2xl'"
      />
    </div>
  </div>
</template>

<script setup>
import TheSidebar from "@/components/TheSidebar.vue";
import FriendsList from "@/components/FriendsList.vue";
import useBreakpoints from "@/composable/useBreakpoints";

let breakpoints = useBreakpoints();
</script>
