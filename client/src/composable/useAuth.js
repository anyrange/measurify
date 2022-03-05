import { computed } from "vue";
import { useUserStore } from "@/stores/user";
import { useProfileStore } from "@/stores/profile";

export const useAuth = () => {
  const userStore = useUserStore();
  const profileStore = useProfileStore();

  const user = computed(() => {
    return userStore.user;
  });

  const profile = computed(() => {
    return profileStore.profile;
  });

  const isAuthenticated = computed(() => {
    return userStore.isAuthenticated;
  });

  const isUserProfile = computed(() => {
    return profile.value.user.username === user.value.username;
  });

  return { isUserProfile, isAuthenticated };
};
