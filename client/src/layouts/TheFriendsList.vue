<template>
  <aside
    id="friends-list"
    class="
      hidden
      xl:flex
      flex-col
      w-60
      items-center
      h-screen
      bg-gray-900-spotify bg-opacity-50
      overflow-y-auto
      gap-4
      px-3
    "
  >
    <div
      class="
        h-12
        md:flex
        flex-row
        hidden
        w-full
        items-center
        border-b
        default-border
        text-white
        select-none
      "
    >
      <span class="text-lg font-medium">Friend Activity</span>
    </div>
    <div class="h-full">
      <suspense-wrapper :loading="loading" :error="error">
        <div class="flex flex-col gap-4 items-center">
          <friend-item
            v-for="friend in friendsSortedByLastListened"
            :key="friend.username"
            :friend="friend"
            @listening-now="handleListener"
          />
        </div>
      </suspense-wrapper>
    </div>
  </aside>
</template>

<script setup>
import { computed, ref } from "vue";
import { useFetch } from "@/composable/useFetch";
import { getFriends } from "@/api";
import { orderByDate } from "@/utils";

const { fetchData, loading, error } = useFetch();

const friends = ref(null);

fetchData(async () => {
  const { friends: friendsData } = await getFriends();
  friends.value = friendsData;
});

const friendsSortedByLastListened = computed(() =>
  orderByDate(friends.value, "lastPlayed").sort(
    (a, b) => (b.isListening || false) - (a.isListening || false)
  )
);

const handleListener = (user) => {
  const friend = friends.value.find((friend) => friend.username === user);
  friend.isListening = true;
};
</script>
