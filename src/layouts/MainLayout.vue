<template>
  <div class="flex flex-col h-screen text-sm text-gray-400">
    <div class="flex-1 flex overflow-y-hidden">
      <sidebar />
      <div class="flex-1 flex flex-col bg-gray-800-spotify">
        <navbar />
        <div class="content-spotify overflow-y-auto md:mb-0 mb-12">
          <div class="container sm:px-10 px-4">
            <router-view />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { getToken } from "@/api";

export default {
  name: "Layout",
  components: {
    Sidebar,
    Navbar,
  },
  async created() {
    await getToken();
  },
};
</script>
