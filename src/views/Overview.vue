<template>
  <div class="container mx-auto">
    <div class="mt-12">
      <div
        class="w-1/5 px-4 text-base leading-6 space-y-4 text-gray-300 sm:text-lg sm:leading-7"
      >
        <div>
          <a href="#">
            <img
              :src="this.user.images[0].url"
              alt="album cover"
              class="object-fill h-52 w-52"
            />
          </a>
        </div>
        <div>
          <h1>Account name: {{ this.user.display_name }}</h1>
          <p>Email address: {{ this.user.email }}</p>
          <p class="underline">
            <a :href="this.user.external_urls.spotify">Link to your profile</a>
          </p>
          <p>Number of followers: {{ this.user.followers.total }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
  },
  methods: {
    logOut() {
      this.$store.commit("mutateUser", null);
      this.$router.push({ name: "Home" });
    },
  },
};
</script>
