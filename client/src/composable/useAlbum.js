import { watch, computed, ref } from "vue";
import { useFetch } from "./useFetch.js";
import { getAlbum } from "@/api";
import { useRoute } from "vue-router";
import { useTitle } from "@vueuse/core";

export function useAlbum() {
  const { fetchData, loading, error } = useFetch();

  const title = useTitle();
  const route = useRoute();

  const albumId = computed(() => route.params.albumId);

  const albumData = ref(null);

  function updateAlbum(data) {
    albumData.value = data;
  }

  async function fetchAlbum() {
    updateAlbum(null);
    if (!albumId.value) return;
    await fetchData(async () => {
      updateAlbum(await getAlbum(albumId.value));
    });
    title.value = albumData.value ? albumData.value.album.name : null;
  }

  watch(albumId, fetchAlbum, { immediate: true });

  return {
    albumData,
    loading,
    error,
  };
}
