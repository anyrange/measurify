<template>
  <div v-if="parallax" :style="{ backgroundImage: `url('${imageUrl}')` }"></div>
  <img v-else :src="imageUrl" :alt="alt" />
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
      imageExists: false,
    };
  },
  methods: {
    checkImage(url) {
      const image = new Image();
      image.src = url;
      image.onerror = () => {
        this.imageExists = false;
        return;
      };
      this.imageExists = true;
    },
  },
  created() {
    this.checkImage(this.src);
  },
  computed: {
    imageUrl() {
      if (this.imageExists) return this.src;
      return this.fallbackImage;
    },
    fallbackImage() {
      if (this.avatar) return "/img/noavatar.svg";
      return "/img/noimage.svg";
    },
  },
};
</script>
