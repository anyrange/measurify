import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import { ref, computed } from "vue";
import { logout as apiLogout, getCurrentUser, checkAuthorization } from "@/api";

export const useUserStore = defineStore("user", () => {
  const user = ref(null);
  const router = useRouter();

  const isAuthenticated = computed(() => !!user.value);

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
      await router.push({ name: "home" });
      await apiLogout();
      user.value = null;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  return { user, isAuthenticated, updateUser, logout };
});
