import { watch, computed, ref } from "vue";
import { useFetch } from "./useFetch.js";
import {
  getProfile,
  getProfileListeningHistory,
  // getProfileReports,
} from "@/api";
import { useProfileStore } from "@/stores/profile.js";
import { useSettingsStore } from "@/stores/settings.js";
import { useRoute, useRouter } from "vue-router";

export function useProfile() {
  const { fetchData, loading, error } = useFetch();
  const route = useRoute();

  const username = computed(() => route.params.username);

  const profileStore = useProfileStore();

  function updateProfile(data) {
    profileStore.profile = data;
  }

  async function fetchProfile() {
    updateProfile(null);
    if (!username.value) return;
    await fetchData(async () => {
      updateProfile(await getProfile({ username: username.value }));
    });
  }

  watch(username, fetchProfile, { immediate: true });

  return {
    profile: computed(() => profileStore.profile),
    loading,
    error,
  };
}

export function useHistory() {
  const { fetchData, loading, error } = useFetch();
  const profileStore = useProfileStore();
  const settingsStore = useSettingsStore();

  const listeningHistory = ref({
    history: [],
    pages: 0,
  });
  const page = ref(1);
  const range = computed({
    get: () => settingsStore.listeningHistoryRange,
    set: (value) =>
      settingsStore.$patch({
        listeningHistoryRange: value,
      }),
  });

  const search = ref("");

  const route = useRoute();
  const router = useRouter();

  function updateHistory(data) {
    Object.assign(listeningHistory.value, data);
  }

  async function fetchHistory(params) {
    updateHistory({
      history: null,
    });
    await fetchData(async () => {
      const data = await getProfileListeningHistory({
        ...params,
        username: profileStore.profile.user.username,
      });
      updateHistory(data);
    });
  }

  const { query } = route;
  page.value = parseInt(query.page) || page.value;
  range.value = parseInt(query.range) || range.value;
  search.value = query.search || search.value;

  watch(
    [search, range, page],
    async ([nSearch, nRange, nPage], [oSearch, oRange]) => {
      if ((oRange && nRange !== oRange) || (oSearch && nSearch !== oSearch)) {
        page.value = 1;
      }

      const query = { search: nSearch, range: nRange, page: nPage };
      await fetchHistory(query).then(() => {
        router.push({ path: route.path, query });
      });
    },
    { immediate: true }
  );

  return {
    listeningHistory,
    loading,
    error,
    range,
    page,
    search,
  };
}

// export function useReports() {
//   const { fetchData, loading, error } = useFetch();
//   const profileStore = useProfileStore();

//   const reports = ref(null);

//   function updateReports(data) {
//     reports.value = data;
//   }

//   (async () => {
//     updateReports(null);
//     await fetchData(async () => {
//       updateReports(
//         await getProfileReports({
//           username: profileStore.profile.user.username,
//         })
//       );
//     });
//   })();

//   return {
//     reports,
//     loading,
//     error,
//   };
// }
