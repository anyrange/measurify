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
    <div v-if="parallax" :style="{ backgroundImage: `url('${imageUrl}')` }" />
    <img
      v-else
      v-lazy="{
        src: lazyOptions.src,
        error: lazyOptions.error,
        loading: lazyOptions.loading,
      }"
      :alt="alt"
      aria-hidden="false"
      draggable="false"
    />
  </transition>
</template>

<script setup>
import { reactive, computed, ref } from "vue";
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
});

const FALLBACK_IMAGES = {
  profile: fallbackProfileImage,
  track: fallbackTrackImage,
  album: fallbackTrackImage,
  artist: fallbackArtistImage,
};

const fallbackImage = computed(() => {
  return FALLBACK_IMAGES[props.imageType];
});

const imageUrl = ref("");

const lazyOptions = reactive({
  src: props.src,
  error: fallbackImage.value,
  loading: fallbackImage.value,
});

if (props.parallax) {
  const fetchImage = async () => {
    const checkImage = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(url);
        img.onerror = () => reject("Failed to load image");
      });
    };
    try {
      imageUrl.value = await checkImage(props.src);
    } catch (err) {
      imageUrl.value = fallbackImage.value;
    }
  };

  fetchImage();
}
</script>
