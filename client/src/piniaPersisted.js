import { watch } from "vue";

export const createPersistedState =
  (options) =>
  ({ store }) => {
    const storage = options.storage || (window && window.localStorage);
    const modules = options.modules;

    const key = store.$id;
    const isPersited = modules.includes(key);

    function getState(key, storage) {
      const value = storage.getItem(key);
      try {
        return typeof value === "string"
          ? JSON.parse(value)
          : typeof value === "object"
          ? value
          : undefined;
      } catch (err) {
        console.error(err);
      }
      return undefined;
    }
    function setState(key, state, storage) {
      return storage.setItem(key, JSON.stringify(state));
    }

    const localState = getState(key, storage);

    if (localState) {
      store.$patch(localState);
      setState(key, store.$state, storage);
    }

    watch(
      store.$state,
      () => {
        isPersited && setState(key, store.$state, storage);
      },
      { immediate: true }
    );
  };
