<template>
  <div
    class="flex flex-col h-screen text-sm text-gray-500-spotify"
    :class="{ 'custom-scrollbars': !isMobile }"
  >
    <div class="flex-1 flex overflow-y-hidden">
      <sidebar />
      <div class="flex-1 flex flex-col bg-gray-800-spotify">
        <div class="content-spotify overflow-y-auto sm:mb-0 mb-12">
          <div class="flex flex-col gap-6 xl:px-20 px-4 py-8">
            <router-view />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar";

export default {
  name: "Layout",
  components: { Sidebar },
};
</script>
