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
          <profile-activity-report :username="profileUsername" />
          <template #fallback>
            <loading-spinner class="h-[300px]" />
          </template>
        </suspense>
      </container-item>
    </div>
    <container-item class="w-full">
      <container-item-label> Timeline </container-item-label>
      <suspense>
        <profile-timeline-report :username="profileUsername" />
        <template #fallback>
          <loading-spinner class="h-[500px]" />
        </template>
      </suspense>
    </container-item>
  </container>
</template>

<script setup>
import { computed } from "vue";
import { useTitle } from "@vueuse/core";
import { useProfileStore } from "@/stores/profile";

const title = useTitle();
const profileStore = useProfileStore();

const profileUsername = computed(() => {
  return profileStore.profile.user.username;
});

title.value = `${profileStore.profile.user.display_name}'s listening report`;
</script>
