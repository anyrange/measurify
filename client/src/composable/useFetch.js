import { ref } from "vue";

export function useFetch() {
  const loading = ref(false);
  const error = ref(false);

  async function fetchData(cb) {
    loading.value = true;
    try {
      const data = await cb();
      error.value = false;
      return Promise.resolve(data);
    } catch (err) {
      error.value = true;
      return Promise.reject(err);
    } finally {
      loading.value = false;
    }
  }

  return {
    fetchData,
    loading,
    error,
  };
}
