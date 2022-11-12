<template>
  <container>
    <div
      class="flex flex-col flex-wrap justify-between gap-2 xl:gap-0 xl:flex-row"
    >
      <container-item class="xl:w-6/10">
        <container-item-label> Genres </container-item-label>
        <suspense>
          <profile-genres-report :username="profileUsername" />
          <template #fallback>
            <loading-spinner class="h-[300px]" />
          </template>
        </suspense>
      </container-item>
      <container-item class="xl:w-4/10">
        <container-item-label> Activity </container-item-label>
        <suspense>
          <profile-activity-report :username="profileUsername" :range="range" />
          <template #fallback>
            <loading-spinner class="h-[300px]" />
          </template>
        </suspense>
      </container-item>
    </div>
    <container-item class="w-full">
      <container-item-label> Timeline </container-item-label>
      <suspense>
        <profile-timeline-report :username="profileUsername" :range="range" />
        <template #fallback>
          <loading-spinner class="h-[500px]" />
        </template>
      </suspense>
    </container-item>
  </container>
</template>

<script setup>
import { computed, ref } from "vue"
import { useTitle } from "@vueuse/core"
import { useRouteQuery } from "@vueuse/router"
import { useProfileStore } from "@/stores/profile"

const profileStore = useProfileStore()

useTitle(`${profileStore.profile.user.display_name}'s listening report`)

const rangeOptions = {
  week: "Last week",
  month: "Last month",
  overall: "All time",
}

const range = useRouteQuery("range", "week")

const currentRange = computed(() => profileStore.dateRanges[range.value])
const customRange = ref({ ...currentRange.value })

const profileUsername = computed(() => {
  return profileStore.profile.user.username
})
</script>
