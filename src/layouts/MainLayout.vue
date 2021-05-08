<template>
  <div class="flex flex-col h-screen text-sm dark:text-gray-400 text-gray-900">
    <div class="flex-1 flex overflow-y-hidden">
      <sidebar />
      <div class="dark:bg-gray-800-spotify bg-gray-100 flex-1 flex flex-col">
        <div class="top-bar flex items-center justify-end px-4">
          <user />
        </div>
        <div class="content-spotify overflow-y-auto md:mb-0 mb-12">
          <div class="container mx-auto">
            <router-view />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar";
import User from "@/components/User";
import api from "@/api";

export default {
  name: "Layout",
  components: {
    Sidebar,
    User,
  },
  created() {
    api.getToken().catch((error) => {
      console.error(error);
    });
  },
};
</script>
