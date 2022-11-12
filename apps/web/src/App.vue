<template>
  <div class="h-screen">
    <template v-if="loading">
      <loading-spinner />
    </template>
    <template v-else>
      <div
        class="h-screen flex flex-col text-secondary-lighter text-sm"
        :class="{ 'custom-scrollbar': !isMobile }"
      >
        <div class="flex flex-1 overflow-y-hidden">
          <app-sidebar />
          <main class="flex flex-1 flex-col bg-secondary-darkest">
            <div
              id="content-window"
              ref="mainWindow"
              class="overflow-y-auto flex flex-col h-full px-4 pb-4 mb-12 sm:px-8 sm:mb-0"
              style="overflow: overlay"
            >
              <router-view />
            </div>
          </main>
          <app-friends :show="xlAndLarger" />
        </div>
      </div>
    </template>
    <notifications />
  </div>
</template>

<script setup>
import { provide, ref } from "vue"
import { useNavigator } from "@/composable/useNavigator"
import { useUserStore } from "@/stores/user"
import { createAsyncProcess } from "@/composable/useAsync"
import { useBreakpoints } from "@/composable/useBreakpoints"
import { useQuery } from "@/composable/useQuery"

const userStore = useUserStore()
const { isMobile } = useNavigator()
const { xlAndLarger } = useBreakpoints()
const { query } = useQuery()

const mainWindow = ref()

provide("historyLength", window.history.length)

provide("contentWindow", mainWindow)

const { token } = query
if (!userStore.token && token) userStore.token = token

const { loading, run } = createAsyncProcess(userStore.updateUser)

run()
</script>
