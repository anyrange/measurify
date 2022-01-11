import { watch, computed, ref } from "vue";
import { useFetch } from "./useFetch.js";
import { getArtist } from "@/api";
import { useRoute } from "vue-router";
import { useTitle } from "@vueuse/core";

export function useArtist() {
  const { fetchData, loading, error } = useFetch();

  const title = useTitle();
  const route = useRoute();

  const artistId = computed(() => route.params.artistId);

  const artistData = ref(null);

  function updateArtist(data) {
    artistData.value = data;
  }

  async function fetchArtist() {
    updateArtist(null);
    if (!artistId.value) return;
    await fetchData(async () => {
      updateArtist(await getArtist(artistId.value));
    });
    title.value = artistData.value ? artistData.value.artist.name : null;
  }

  watch(artistId, fetchArtist, { immediate: true });

  return {
    artistData,
    loading,
    error,
  };
}
