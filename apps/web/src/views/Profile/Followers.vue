<template>
  <template v-if="loading">
    <followers-grid>
      <spotify-card-skeleton
        v-for="i in profileStore.profile.followers"
        :key="i"
        type="profile"
      />
    </followers-grid>
  </template>
  <template v-else>
    <template v-if="followers.length">
      <followers-grid>
        <spotify-card
          v-for="follower in followers"
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
        {{ profileStore.profile.user.display_name }} doesn't have any followers
        yet.
      </blankslate>
    </template>
  </template>
</template>

<script setup>
import { ref } from "vue"
import { useTitle } from "@vueuse/core"
import { useProfileStore } from "@/stores/profile"
import { createAsyncProcess } from "@/composable/useAsync"
import { getFollowers } from "@/api"

const profileStore = useProfileStore()

useTitle(`People Following ${profileStore.profile.user.display_name}`)

const followers = ref([])

const { loading, run: fetchFollowers } = createAsyncProcess(async () => {
  followers.value = await getFollowers(profileStore.profile.user.username)
})

fetchFollowers()
</script>
