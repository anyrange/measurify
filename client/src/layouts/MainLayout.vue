<template>
  <div
    class="flex flex-col h-screen text-sm text-gray-500-spotify"
    :class="{ 'custom-scrollbar': !isMobile }"
  >
    <div class="flex-1 flex overflow-y-hidden">
      <the-sidebar />
      <div class="flex-1 flex flex-col bg-gray-900-spotify">
        <!-- <the-app-bar /> -->
        <div class="content-window">
          <div class="container flex flex-col gap-4">
            <router-view />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TheSidebar from "@/components/TheSidebar";
import TheAppBar from "@/components/TheAppBar";

export default {
  name: "Layout",
  components: {
    TheSidebar,
    // eslint-disable-next-line vue/no-unused-components
    TheAppBar,
  },
};
</script>
