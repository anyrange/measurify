<template>
  <router-view />
  <notifications />
</template>

<script setup>
import { provide } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";

const router = useRouter();
const user = useUserStore();

provide("historyLength", window.history.length);

const isAuthenticated = user.isAuthenticated;

(async () => {
  try {
    await user.updateUser();
    !isAuthenticated && router.push({ name: "home" });
  } catch {
    await user.logout();
  }
})();
</script>
