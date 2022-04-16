<template>
  <container>
    <div class="flex items-center justify-between">
      <tabs v-model="type">
        <tab name="artists" :disabled="loading"> Artists </tab>
        <tab name="albums" :disabled="loading"> Albums </tab>
        <tab name="tracks" :disabled="loading"> Tracks </tab>
      </tabs>
    </div>
    <ul class="-mt-1 grid grid-cols-1 divide-secondary-darker divide-y">
      <template
        v-for="(item, index) in loading ? Number(range) : libraryData.data"
        :key="index"
      >
        <template v-if="loading">
          <library-item-skeleton
            :type="type"
            :place="(page - 1) * range + index + 1"
          />
        </template>
        <template v-else>
          <library-item
            :item="item"
            :place="(page - 1) * range + index + 1"
            :type="type"
          />
        </template>
      </template>
    </ul>
    <pagination
      class="flex justify-center"
      v-model="page"
      :total-pages="libraryData.pages"
    />
  </container>
</template>

<script setup>
import { ref, watch } from "vue";
import { useTitle } from "@vueuse/core";
import { useRouteQuery } from "@vueuse/router";
import { useProfileStore } from "@/stores/profile";
import { usePagination } from "@/composable/usePagination";
import { useContentWindow } from "@/composable/useContentWindow";
import { createAsyncProcess } from "@/composable/useAsync";
import {
  getProfileAlbumsLibrary,
  getProfileTracksLibrary,
  getProfileArtistsLibrary,
} from "@/api";

const { scrollToTop } = useContentWindow();

const profileStore = useProfileStore();

useTitle(`${profileStore.profile.user.display_name}'s music library`);

const type = useRouteQuery("type", "artists");
const page = useRouteQuery("page", 1);
const range = ref(50);

const libraryData = ref({
  data: [],
  pages: 0,
});

function updateData(data) {
  Object.assign(libraryData.value, data);
}

const fetchOptions = {
  artists: getProfileArtistsLibrary,
  albums: getProfileAlbumsLibrary,
  tracks: getProfileTracksLibrary,
};

const { loading, run: fetchLibrary } = createAsyncProcess(async (params) => {
  updateData({ data: null, pages: 0 });
  try {
    const response = await fetchOptions[type.value]({
      ...params,
      username: profileStore.profile.user.username,
    });
    const data = response[type.value];
    const pages = response.pages;
    updateData({ pages, data });
  } catch (error) {
    return Promise.reject(error);
  }
});

const { fetch } = usePagination({
  fn: fetchLibrary,
  range,
  page,
  onUpdate: scrollToTop,
});

watch(
  type,
  (newValue, oldValue) => {
    if (oldValue && newValue !== oldValue) {
      page.value = 1;
    }
    fetch();
  },
  { immediate: true }
);
</script>
