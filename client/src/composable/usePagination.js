import { ref, watch, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

export function usePagination(fn, customRange) {
  const route = useRoute();
  const router = useRouter();

  const page = ref(1);
  const search = ref("");
  const range = customRange || ref(10);

  const pageStateOptions = computed(() => {
    return {
      search: search.value,
      page: page.value,
      range: range.value,
    };
  });

  onMounted(() => {
    const { query } = route;
    page.value = parseInt(query.page) || page.value;
    range.value = parseInt(query.range) || range.value;
    search.value = query.search || search.value;
  });

  watch(
    pageStateOptions,
    async (query) => {
      await fn(query).then(() => {
        router.push({ path: route.path, query });
      });
    },
    {
      immediate: true,
    }
  );

  watch([search, range], () => {
    page.value = 1;
  });

  return {
    page,
    range,
    search,
  };
}
