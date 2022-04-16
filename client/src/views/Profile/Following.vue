<template>
  <template v-if="loading">
    <followers-grid>
      <spotify-card-skeleton
        v-for="i in profileStore.profile.follows"
        :key="i"
        type="profile"
      />
    </followers-grid>
  </template>
  <template v-else>
    <template v-if="following.length">
      <followers-grid>
        <spotify-card
          v-for="follower in following"
          :key="follower.username"
          type="profile"
          :item="{
            name: follower.display_name,
            image: follower.avatar,
            id: follower.username,
          }"
        />
      </followers-grid>
    </template>
    <template v-else>
      <blankslate>
        {{ profileStore.profile.user.display_name }} haven't followed anyone
        yet.
      </blankslate>
    </template>
  </template>
</template>

<script setup>
import { ref } from "vue";
import { useTitle } from "@vueuse/core";
import { useProfileStore } from "@/stores/profile";
import { createAsyncProcess } from "@/composable/useAsync";
import { getFollowing } from "@/api";

const profileStore = useProfileStore();

useTitle(`People ${profileStore.profile.user.display_name} Follows`);

const following = ref([]);

const { loading, run: fetchFollowing } = createAsyncProcess(async () => {
  following.value = await getFollowing(profileStore.profile.user.username);
});

fetchFollowing();
</script>
