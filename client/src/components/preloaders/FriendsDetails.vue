<template>
  <li
    v-for="friend in friendsSortedByLastListened"
    :key="friend.username"
    v-bind="$attrs"
  >
    <friend-item :friend="friend" />
  </li>
</template>

<script setup>
import { computed, ref } from "vue";
import { getFollowing } from "@/api";
import { orderByDate } from "@/utils";
import { useUserStore } from "@/stores/user";

const friends = ref(null);

const userStore = useUserStore();

friends.value = await getFollowing(userStore.user.username);

const friendsSortedByLastListened = computed(() => {
  return orderByDate(friends.value, "lastPlayed");
});
</script>
