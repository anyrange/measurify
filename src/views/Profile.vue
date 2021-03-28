<template>
  <div class="container mx-auto">
    <h2 class="h-title">
      {{ this.user.display_name }}
    </h2>
    <!-- <h2 class="h-title">
      {{ $route.params.name }}
    </h2> -->
    <h3 class="mx-4 mt-4 text-lg font-semibold text-gray-500">
      {{ this.user.email }}
    </h3>
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
