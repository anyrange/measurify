<template>
  <div v-if="loading" class="bg-gray-700-spotify animate-pulse">&nbsp;</div>
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
</template>

<script setup>
import { ref, watch } from "vue";
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

const loading = ref(false);
const imageUrl = ref("");

const checkImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(url);
    img.onerror = () => reject("Failed to load image");
  });
};

const handleImage = async () => {
  loading.value = true;
  try {
    imageUrl.value = await checkImage(props.src);
  } catch (err) {
    imageUrl.value = FALLBACK_IMAGES[props.imageType];
  } finally {
    loading.value = false;
  }
};

watch(() => props.src, handleImage, { immediate: true });
</script>
