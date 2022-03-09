<template>
  <div ref="target">
    <transition
      enter-active-class="transition ease-out"
      enter-from-class="transform opacity-0"
      enter-to-class="transform opacity-100"
      leave-active-class="transition ease-in"
      leave-from-class="transform opacity-100"
      leave-to-class="transform opacity-0"
      mode="out-in"
    >
      <template v-if="loaded">
        <div v-if="loading">&nbsp;</div>
        <img
          v-else
          :src="imageUrl"
          :alt="alt"
          v-bind="$attrs"
          aria-hidden="false"
          draggable="false"
        />
      </template>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useIntersectionObserver } from "@vueuse/core";
import { createAsyncProcess } from "@/composable/useAsync";
import fallbackProfileImage from "@/assets/media/fallback-profile.svg";
import fallbackTrackImage from "@/assets/media/fallback-track.svg";
import fallbackArtistImage from "@/assets/media/fallback-artist.svg";

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: true,
  },
  imageType: {
    type: String,
    required: false,
    default: "profile",
  },
});

const FALLBACK_IMAGES = {
  profile: fallbackProfileImage,
  track: fallbackTrackImage,
  album: fallbackTrackImage,
  artist: fallbackArtistImage,
};

const imageUrl = ref("");
const loaded = ref(false);

const target = ref(null);
const targetIsVisible = ref(false);

const checkImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(url);
    img.onerror = () => reject("Failed to load image");
  });
};

const fetchImage = async () => {
  try {
    imageUrl.value = await checkImage(props.src);
  } catch (err) {
    imageUrl.value = FALLBACK_IMAGES[props.imageType];
  } finally {
    loaded.value = true;
  }
};

const { loading, run: loadImage } = createAsyncProcess(fetchImage);

useIntersectionObserver(target, ([{ isIntersecting }]) => {
  targetIsVisible.value = isIntersecting;
});

watch(
  [() => props.src, targetIsVisible],
  () => {
    if (!loaded.value && targetIsVisible.value) {
      loadImage();
    }
  },
  { immediate: true }
);
</script>
