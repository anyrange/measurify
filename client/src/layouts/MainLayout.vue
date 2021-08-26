<template>
  <div
    class="flex flex-col h-screen text-sm text-gray-500-spotify"
    :class="{ 'custom-scrollbar': !isMobile }"
  >
    <div class="flex-1 flex overflow-y-hidden">
      <sidebar />
      <div class="flex-1 flex flex-col bg-gray-800-spotify">
        <div class="content-window">
          <!-- <navbar /> -->
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default {
  name: "Layout",
  components: {
    Sidebar,
    // eslint-disable-next-line vue/no-unused-components
    Navbar,
  },
};
</script>
