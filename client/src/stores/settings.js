import { defineStore } from "pinia";
import { ref } from "vue";

export const useSettingsStore = defineStore("settings", () => {
  return {
    listeningHistoryRange: ref(50),
  };
});
