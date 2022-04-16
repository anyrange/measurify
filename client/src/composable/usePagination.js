import { ref, watch, computed } from "vue";

const noop = () => {
  // do nothing
};

export function usePagination({
  fn,
  range,
  page,
  search = ref(""),
  onUpdate = noop,
  immediate = false,
}) {
  const pageStateOptions = computed(() => {
    return {
      search: search.value,
      page: page.value,
      range: range.value,
    };
  });

  const fetch = () => {
    fn(pageStateOptions.value);
  };

  watch(pageStateOptions, async (query) => {
    onUpdate();
    await fn(query);
  });

  watch([search, range], () => {
    page.value = 1;
  });

  if (immediate) {
    fetch();
  }

  return {
    fetch,
  };
}
