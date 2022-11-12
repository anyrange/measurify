import { defineStore } from "pinia"
import { ref, computed } from "vue"
import { useUserStore } from "@/stores/user"
import { getFollowing } from "@/api"
import { orderByDate } from "@/utils"
import { createAsyncProcess } from "@/composable/useAsync"

export const useFriendsStore = defineStore("friends", () => {
  const friends = ref(null)

  const userStore = useUserStore()

  const fetchFriends = async () => {
    friends.value = await getFollowing(userStore.user.username)
  }

  const friendsSortedByLastListened = computed(() => {
    return orderByDate(friends.value, "lastPlayed")
  })

  const { run: updateFriends, loading } = createAsyncProcess(fetchFriends)

  return {
    updateFriends,
    loading,
    friends,
    fetchFriends,
    friendsSortedByLastListened,
  }
})
