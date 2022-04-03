import { ref, watch, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const noop = () => {
  // do nothing
};

export function usePagination(fn, customRange, update = noop) {
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

  const parseQuery = () => {
    const { query } = route;
    page.value ??= parseInt(query.page);
    range.value ??= parseInt(query.range);
    search.value ??= query.search;
  };

  onMounted(async () => {
    parseQuery();
    await fn(pageStateOptions.value);
  });

  watch(pageStateOptions, async (query) => {
    update();
    await fn(query);

    const filteredQuery = {
      ...(query.search && { search: query.search }),
      page: query.page,
      range: query.range,
    };

    router.push({ path: route.path, query: filteredQuery });
  });

  watch([search, range], () => {
    page.value = 1;
  });

  return {
    page,
    range,
    search,
  };
}
