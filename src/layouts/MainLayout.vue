<template>
  <div class="flex flex-col h-screen text-sm text-gray-400">
    <div class="flex-1 flex overflow-y-hidden">
      <sidebar />
      <div class="flex-1 flex flex-col bg-gray-800-spotify">
        <div class="content-spotify overflow-y-auto sm:mb-0 mb-12">
          <div class="px-4 md:px-20 pt-8">
            <router-view />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar";
import { mapActions } from "vuex";

export default {
  name: "Layout",
  components: { Sidebar },
  methods: {
    ...mapActions(["updateUser"]),
  },
  async created() {
    await this.updateUser();
  },
};
</script>
