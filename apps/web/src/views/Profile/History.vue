<template>
  <container>
    <container-item>
      <div class="flex justify-between">
        <div class="flex gap-x-2">
          <base-input
            v-model.lazy="search"
            placeholder="Search"
            :debounce="400"
          />
          <base-select v-model="range" :options="RANGE_OPTIONS" />
        </div>
        <pagination
          v-if="xlAndLarger"
          v-model="page"
          :total-pages="listeningHistory.pages || 0"
        />
      </div>
      <track-rows>
        <div
          v-for="(item, index) in loading
            ? Number(range)
            : listeningHistory.history"
          :key="index"
        >
          <template v-if="loading">
            <track-row-skeleton />
          </template>
          <template v-else>
            <track-row :track="item" date />
          </template>
        </div>
      </track-rows>
      <pagination
        class="flex justify-center"
        v-model="page"
        :total-pages="listeningHistory.pages || 0"
      />
    </container-item>
  </container>
</template>

<script setup>
import { ref } from "vue"
import { useTitle } from "@vueuse/core"
import { useProfileStore } from "@/stores/profile"
import { usePagination } from "@/composable/usePagination"
import { useRouteQuery } from "@vueuse/router"
import { useBreakpoints } from "@/composable/useBreakpoints"
import { useContentWindow } from "@/composable/useContentWindow"
import { createAsyncProcess } from "@/composable/useAsync"
import { getProfileListeningHistory } from "@/api"
import { RANGE_OPTIONS } from "@/config"

const { scrollToTop } = useContentWindow()
const { xlAndLarger } = useBreakpoints()

const profileStore = useProfileStore()

useTitle(`${profileStore.profile.user.display_name}'s listening history`)

const listeningHistory = ref({ history: [], pages: 0 })

const page = useRouteQuery("page", 1)
const search = useRouteQuery("search", "")
const range = useRouteQuery("range", 50)

function updateHistory(data) {
  Object.assign(listeningHistory.value, data)
}

async function fetchHistory(params) {
  updateHistory({ history: null })
  try {
    const data = await getProfileListeningHistory({
      ...params,
      username: profileStore.profile.user.username,
    })
    updateHistory(data)
  } catch (error) {
    return Promise.reject(error)
  }
}

const { loading, run: getHistory } = createAsyncProcess(fetchHistory)

usePagination({
  fn: getHistory,
  range,
  page,
  search,
  onUpdate: scrollToTop,
  immediate: true,
})
</script>
