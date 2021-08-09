<template>
  <loading-spinner v-if="loading" />
  <div
    v-else-if="parallax"
    class="bg-no-repeat bg-fixed bg-top bg-contain"
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
  async created() {
    try {
      this.imageUrl = await this.checkImage(this.src);
    } catch (err) {
      this.setFallbackImage();
      console.log(`${err} for ${this.alt}`);
    } finally {
      this.loading = false;
    }
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
    setFallbackImage() {
      this.imageUrl = this.avatar ? "/img/noavatar.svg" : "/img/noimage.svg";
    },
  },
};
</script>
