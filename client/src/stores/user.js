import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import { ref, computed } from "vue";
import { logout as apiLogout, getCurrentUser } from "@/api";

export const useUserStore = defineStore("user", () => {
  let user = ref(null);
  const router = useRouter();

  const isAuthenticated = computed(() => !!user.value);

  async function updateUser() {
    try {
      user.value = await getCurrentUser();
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async function logout() {
    try {
      await apiLogout();
      user.value = null;
      router.push({ name: "login" });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  return { user, isAuthenticated, updateUser, logout };
});
