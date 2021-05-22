<template>
  <div class="flex flex-col h-screen text-sm dark:text-gray-400 text-gray-900">
    <div class="flex-1 flex overflow-y-hidden">
      <sidebar />
      <div class="flex-1 flex flex-col dark:bg-gray-800-spotify bg-gray-100">
        <navbar />
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
import Navbar from "@/components/Navbar";
import api from "@/api";

export default {
  name: "Layout",
  components: {
    Sidebar,
    Navbar,
  },
  created() {
    api.getToken().catch((error) => {
      this.$notify.show({
        type: "danger",
        message: error.response.data.message,
      });
    });
  },
  beforeMount() {
    this.$notify.reset();
  },
};
</script>
