<template>
  <transition
    enter-active-class="transition ease-out"
    enter-from-class="transform opacity-0"
    enter-to-class="transform opacity-100"
    leave-active-class="transition ease-in"
    leave-from-class="transform opacity-100"
    leave-to-class="transform opacity-0"
    mode="out-in"
  >
    <div v-if="loading">&nbsp;</div>
    <div
      v-else-if="parallax"
      :style="{ backgroundImage: `url('${imageUrl}')` }"
    />
    <img
      v-else
      class="select-none"
      aria-hidden="false"
      draggable="false"
      loading="lazy"
      :src="imageUrl"
      :alt="alt"
    />
  </transition>
</template>

<script setup>
import { ref, watch } from "vue";
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
  parallax: {
    type: Boolean,
    required: false,
    default: false,
  },
  imageType: {
    type: String,
    required: false,
    default: "profile",
  },
  avatar: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const FALLBACK_IMAGES = {
  profile: fallbackProfileImage,
  track: fallbackTrackImage,
  album: fallbackTrackImage,
  artist: fallbackArtistImage,
};

const imageUrl = ref("");

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
  }
};

const { loading, run: handleImage } = createAsyncProcess(fetchImage);

watch(() => props.src, handleImage, { immediate: true });
</script>
