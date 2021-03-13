<template>
  <div class="min-h-screen flex flex-col bg:gray sm:py-12">
    <div class="relative sm:max-w-xl sm:mx-auto">
      <div class="relative bg-gray-50 shadow-lg sm:rounded-3xl sm:p-10">
        <div class="max-w-md mx-auto">
          <div class="divide-y divide-gray-200">
            <div
              class="text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7"
            >
              <img
                :src="this.user.images[0].url"
                class="rounded-full border border-gray-100 shadow-sm"
              />
              <h1>Account name: {{ this.user.display_name }}</h1>
              <p>Email address: {{ this.user.email }}</p>
              <p class="underline">
                <a :href="this.user.external_urls.spotify"
                  >Link to your profile</a
                >
              </p>
              <p>Number of followers: {{ this.user.followers.total }}</p>
            </div>
          </div>
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
