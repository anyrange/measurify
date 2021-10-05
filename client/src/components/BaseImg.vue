<template>
  <div v-if="loading" class="bg-gray-700-spotify animate-pulse">&nbsp;</div>
  <div
    v-else-if="parallax"
    :style="{ backgroundImage: `url('${imageUrl}')` }"
  />
  <img
    v-else
    class="select-none"
    :src="imageUrl"
    :alt="alt"
    aria-hidden="false"
    draggable="false"
    loading="lazy"
  />
</template>

<script>
import fallbackProfileImage from "@/assets/fallback-profile.svg";
import fallbackTrackImage from "@/assets/fallback-track.svg";
import fallbackArtistImage from "@/assets/fallback-artist.svg";

export default {
  name: "BaseImg",
  props: {
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
  },
  data() {
    return {
      loading: true,
      imageUrl: "",
    };
  },
  watch: {
    src: {
      handler: async function () {
        try {
          this.imageUrl = await this.checkImage(this.src);
        } catch (err) {
          this.imageUrl = this.$options.FALLBACK_IMAGES[this.imageType];
        } finally {
          this.loading = false;
        }
      },
      immediate: true,
    },
  },
  FALLBACK_IMAGES: {
    profile: fallbackProfileImage,
    track: fallbackTrackImage,
    album: fallbackTrackImage,
    artist: fallbackArtistImage,
  },
  methods: {
    checkImage(url) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(url);
        img.onerror = () => reject("Failed to load image");
      });
    },
  },
};
</script>
