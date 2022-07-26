import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import { ref, computed } from "vue";
import { getCurrentUser, checkAuthorization } from "@/api";

export const useUserStore = defineStore("user", () => {
  const user = ref(null);
  const token = ref(null);
  const router = useRouter();

  const isAuthenticated = computed(() => !!user.value && !!token.value);

  async function updateUser() {
    try {
      const { authenticated } = await checkAuthorization();
      if (!authenticated) return;
      user.value = await getCurrentUser();
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async function logout() {
    try {
      token.value = null;
      await router.push({ name: "home" });
      user.value = null;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  return { user, token, isAuthenticated, updateUser, logout };
});
