import { watch } from "vue";

export const useDocument = () => {
  const toggleClass = (watcher, className) => {
    watch(
      watcher,
      (value) => {
        value
          ? document.documentElement.classList.add(className)
          : document.documentElement.classList.remove(className);
      },
      { immediate: true }
    );
  };
  return {
    toggleClass,
  };
};
