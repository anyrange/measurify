import { createAsyncProcess } from "@/composable/useAsync.js"
import { unfollowProfile, followProfile } from "@/api"

export function useFollow({ username, following, onUpdate }) {
  async function toggleFollow() {
    try {
      if (following.value) {
        await unfollowProfile(username.value)
      } else {
        await followProfile(username.value)
      }
      onUpdate()
    } catch (error) {
      console.log(error)
    }
  }
  const { loading, run } = createAsyncProcess(toggleFollow)
  return {
    followProcessGoing: loading,
    toggleFollow: run,
  }
}
