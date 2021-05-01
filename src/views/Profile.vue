<template>
  <!-- 
    <h2 class="h-title">
      {{ $route.params.name }}
    </h2>
  -->
  <div class="flex items-center">
    <div class="">
      <img
        :src="this.user.images[0].url"
        class="rounded-full object-cover w-24 h-24 border-2 border-white shadow-sm"
      />
    </div>
    <div class="ml-2">
      <h2 class="h-title">
        {{ this.user.display_name }}
      </h2>
      <h3 class="mx-4 mt-2 text-lg font-semibold text-gray-500">
        {{ this.user.email }}
      </h3>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hover: false,
    };
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
  },
};
</script>
