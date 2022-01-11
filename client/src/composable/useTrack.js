import { watch, computed, ref } from "vue";
import { useFetch } from "./useFetch.js";
import { getTrack, getTrackLyrics } from "@/api";
import { useRoute } from "vue-router";
import { useTitle } from "@vueuse/core";

export function useTrack() {
  const { fetchData, loading, error } = useFetch();

  const title = useTitle();
  const route = useRoute();

  const trackId = computed(() => route.params.trackId);

  const trackData = ref(null);
  const lyrics = ref({
    status: "idle",
    text: "",
  });

  function updateTrack(data) {
    trackData.value = data;
  }

  async function fetchTrack() {
    updateTrack(null);
    if (!trackId.value) return;
    lyrics.value = {
      text: "",
      status: "idle",
    };
    await fetchData(async () => {
      updateTrack(await getTrack(trackId.value));
    });
    title.value = trackData.value ? trackData.value.track.name : null;
  }

  async function getLyrics() {
    try {
      lyrics.value.status = "loading";
      lyrics.value.text = await getTrackLyrics({
        title: trackData.value.track.name,
        artist: trackData.value.track.artists[0].name,
      }).then((res) => res.lyrics);
      lyrics.value.status = "success";
    } catch {
      lyrics.value.status = "failure";
    }
  }

  watch(trackId, fetchTrack, { immediate: true });

  return {
    trackData,
    loading,
    error,
    lyrics,
    getLyrics,
  };
}
