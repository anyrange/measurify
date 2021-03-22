<template>
  <div class="static" v-if="updateExists">
    <div
      class="absolute bottom-0 right-0 w-full px-3 py-3 shadow-2xl flex flex-col items-center border-t
        sm:w-auto sm:m-4 sm:rounded-lg sm:flex-row sm:border bg-gray-700-spotify border-gray-600 text-white"
    >
      A new version of the application is available.
      <div class="flex mt-2 sm:mt-0 sm:ml-4">
        <button
          @click="refreshApp"
          class="px-3 py-2 bg-green-600-spotify hover:bg-green-700-spotify rounded-lg transition ease-in-out duration-300"
        >
          Refresh
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import update from "@/mixins/update";

export default {
  mixins: [update],
};
</script>
