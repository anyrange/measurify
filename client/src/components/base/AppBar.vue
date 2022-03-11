<template>
  <header
    class="-mx-4 top-0 z-1000 transition-all duration-200 sm:-mx-8"
    :class="[
      [fixed ? 'sticky mb-2' : 'sm:sticky fixed -mb-12'],
      { 'sm:w-auto w-full ': !fixed },
      { 'bg-secondary-darkest shadow-md sm:shadow-none': showAppBar },
    ]"
  >
    <div class="-px-3 h-13 sm:h-12 sm:-px-6">
      <div class="h-full w-full flex items-center justify-between">
        <div class="flex items-center gap-1">
          <slot name="left">
            <base-button
              v-if="isMobile || showAppBar"
              shape="circle"
              @click="goBack"
              :aria-label="showBackButton ? 'Back' : 'Home'"
            >
              <icon
                class="block h-6 w-6 text-white"
                :icon="
                  showBackButton ? 'ic:baseline-arrow-back' : 'ic:round-home'
                "
              />
            </base-button>
          </slot>
          <span class="line-clamp-1 text-lg text-white" v-show="showAppBar">
            <slot name="title"> </slot>
          </span>
        </div>
        <div class="flex items-center gap-2">
          <slot name="right"> </slot>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { onMounted, ref, computed, inject } from "vue";
import { useIntersectionObserver } from "@vueuse/core";
import { useRoute, useRouter } from "vue-router";
import { useNavigator } from "@/composable/useNavigator";

const props = defineProps({
  scrollTarget: {
    type: String,
    required: true,
  },
  fixed: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const initialHistoryLength = inject("historyLength");

const route = useRoute();
const router = useRouter();

const { isMobile } = useNavigator();

const targetIsVisible = ref(true);

const showBackButton = computed(() => {
  return route.name && route.name !== "home";
});

const showAppBar = computed(() => {
  if (props.fixed) return true;
  return !targetIsVisible.value;
});

const goBack = () => {
  if (!showBackButton.value) return;
  const hasHistory = window.history.length - initialHistoryLength !== 0;
  hasHistory ? router.back() : router.push({ name: "home" });
};

onMounted(() => {
  const window = document.querySelector("#content-window");
  const target = document.getElementById(props.scrollTarget);

  if (props.fixed) return;

  useIntersectionObserver(
    target,
    ([{ isIntersecting }]) => {
      targetIsVisible.value = isIntersecting;
    },
    {
      root: window,
    }
  );
});
</script>
